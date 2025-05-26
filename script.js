// Видео-слайдер
const videoSlider = document.querySelector('.video-slider');
const videoSlides = document.querySelectorAll('.video-slide');
const videoPrevBtn = document.querySelector('.prev-slide');
const videoNextBtn = document.querySelector('.next-slide');
let currentVideoSlide = 0;

function showVideoSlide(index) {
  videoSlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    const video = slide.querySelector('video');
    if (i === index) {
      video.play();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });
}

function nextVideoSlide() {
  currentVideoSlide = (currentVideoSlide + 1) % videoSlides.length;
  showVideoSlide(currentVideoSlide);
}

function prevVideoSlide() {
  currentVideoSlide = (currentVideoSlide - 1 + videoSlides.length) % videoSlides.length;
  showVideoSlide(currentVideoSlide);
}

// Автопереключение каждые 8 секунд
let videoInterval = setInterval(nextVideoSlide, 6000);

// Обработчики событий
videoNextBtn.addEventListener('click', () => {
  clearInterval(videoInterval);
  nextVideoSlide();
  videoInterval = setInterval(nextVideoSlide, 6000);
});

videoPrevBtn.addEventListener('click', () => {
  clearInterval(videoInterval);
  prevVideoSlide();
  videoInterval = setInterval(nextVideoSlide, 6000);
});

// Инициализация
showVideoSlide(0);

// Пауза при наведении
videoSlider.addEventListener('mouseenter', () => {
  clearInterval(videoInterval);
});

videoSlider.addEventListener('mouseleave', () => {
  videoInterval = setInterval(nextVideoSlide, 6000);
});

// --- Слайдер "Наши объекты" ---
const projectsSlider = document.querySelector('.projects-slider');
const projectSlides = document.querySelectorAll('.projects-slider .slide');
const sliderDots = document.querySelector('.slider-dots');
const fullscreenProject = document.querySelector('.fullscreen-project');
const fullscreenImage = document.querySelector('.fullscreen-image');
const fullscreenDescription = document.querySelector('.fullscreen-description');
const closeFullscreenButton = document.querySelector('.close-fullscreen');
const prevFullscreenButton = document.querySelector('.prev-fullscreen');
const nextFullscreenButton = document.querySelector('.next-fullscreen');

let currentSlide = 0;
let touchStartX = 0;
let touchEndX = 0;
let isScrolling = false;

// Создание точек
function createDots() {
  if (!sliderDots) return;

  projectSlides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.addEventListener('click', () => goToSlideProject(index));
    sliderDots.appendChild(dot);
  });
  updateDots();
}

// Обновление активной точки
function updateDots() {
  if (!sliderDots) return;

  const dots = document.querySelectorAll('.slider-dots .dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// Переход к слайду
function goToSlideProject(index) {
  currentSlide = index;
  updateDots();
  updateSliderPosition();
}

// Обновление позиции слайдера
function updateSliderPosition() {
  if (projectsSlider) {
    projectsSlider.scrollTo({
      left: currentSlide * projectsSlider.offsetWidth,
      behavior: 'smooth'
    });
  }
}

// Определение текущего слайда при скролле
function handleScroll() {
  if (isScrolling) return;
  
  const scrollPosition = projectsSlider.scrollLeft;
  const slideWidth = projectsSlider.offsetWidth;
  const newSlide = Math.round(scrollPosition / slideWidth);
  
  if (newSlide !== currentSlide) {
    currentSlide = newSlide;
    updateDots();
  }
}

// Открытие полноэкранного режима
function openFullscreen(index) {
  currentSlide = index;
  fullscreenImage.src = projectSlides[index].querySelector('img').src;
  fullscreenDescription.innerHTML = projectSlides[index].querySelector('img').dataset.description;
  fullscreenProject.style.display = 'block';
  updateDots();
}

// Закрытие полноэкранного режима
function closeFullscreen() {
  fullscreenProject.style.display = 'none';
}

// Навигация в полноэкранном режиме
function nextFullscreen() {
  currentSlide = (currentSlide + 1) % projectSlides.length;
  openFullscreen(currentSlide);
}

function prevFullscreen() {
  currentSlide = (currentSlide - 1 + projectSlides.length) % projectSlides.length;
  openFullscreen(currentSlide);
}

// Обработчики событий
projectSlides.forEach((slide, index) => {
  slide.addEventListener('click', () => openFullscreen(index));
});

closeFullscreenButton.addEventListener('click', closeFullscreen);
nextFullscreenButton.addEventListener('click', nextFullscreen);
prevFullscreenButton.addEventListener('click', prevFullscreen);

// Добавляем обработчик скролла
if (projectsSlider) {
  projectsSlider.addEventListener('scroll', handleScroll);
  
  projectsSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  projectsSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > 50) {
      prevFullscreen();
    } else if (swipeDistance < -50) {
      nextFullscreen();
    }
  });
}

// Обработка свайпов для основного слайдера
if (projectsSlider) {
  projectsSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  projectsSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > 50) {
      prevFullscreen();
    } else if (swipeDistance < -50) {
      nextFullscreen();
    }
  });
}

// Обработка свайпов для полноэкранного режима
if (fullscreenProject) {
  fullscreenProject.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  fullscreenProject.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > 50) {
      prevFullscreen();
    } else if (swipeDistance < -50) {
      nextFullscreen();
    }
  }, { passive: true });
}

// Обработка клавиатуры
document.addEventListener('keydown', (e) => {
  if (fullscreenProject && fullscreenProject.style.display === 'block') {
    if (e.key === 'ArrowLeft') prevFullscreen();
    else if (e.key === 'ArrowRight') nextFullscreen();
    else if (e.key === 'Escape') closeFullscreen();
  }
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  if (sliderDots) {
    createDots();
    updateDots();
  }
  updateSliderPosition();
});
// Предзагрузка только metadata для первого видео
document.querySelector('.video-slide.active video').preload = "metadata";

// Остальные видео предзагружаем после загрузки страницы
window.addEventListener('load', () => {
  document.querySelectorAll('.video-slide:not(.active) video').forEach(v => {
    v.preload = "auto";
  });
});
// Автоматическое добавление +7 в поле телефона
document.addEventListener('DOMContentLoaded', function() {
  const phoneInput = document.getElementById('phone');
  
  phoneInput.addEventListener('focus', function() {
      if (!this.value.startsWith('+7')) {
          this.value = '+7';
      }
  });
  
  phoneInput.addEventListener('keydown', function(e) {
      // Запрещаем удаление +7
      if (this.value === '+7' && (e.key === 'Backspace' || e.key === 'Delete')) {
          e.preventDefault();
      }
      
      // Запрещаем редактирование +7
      if (this.selectionStart < 2 && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
          e.preventDefault();
      }
  });
  
  // Форматирование при вводе
  phoneInput.addEventListener('input', function(e) {
      // Удаляем все нецифровые символы кроме +
      let numbers = this.value.replace(/[^\d+]/g, '');
      
      // Оставляем только +7 в начале
      if (!numbers.startsWith('+7')) {
          numbers = '+7' + numbers.replace(/[^\d]/g, '');
      }
      
      // Ограничиваем длину (12 символов: +7 и 10 цифр)
      if (numbers.length > 12) {
          numbers = numbers.substring(0, 12);
      }
      
      // Форматируем с пробелами
      let formatted = '+7';
      if (numbers.length > 2) {
          formatted += ' ' + numbers.substring(2, 5);
      }
      if (numbers.length > 5) {
          formatted += ' ' + numbers.substring(5, 8);
      }
      if (numbers.length > 8) {
          formatted += ' ' + numbers.substring(8, 10);
      }
      if (numbers.length > 10) {
          formatted += ' ' + numbers.substring(10, 12);
      }
      
      this.value = formatted;
      
      // Перемещаем курсор в конец
      this.setSelectionRange(this.value.length, this.value.length);
  });
});