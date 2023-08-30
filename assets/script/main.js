import { removeClasses } from './slider.js';

let isMobile = {
  Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i) }, iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};


window.onload = function () {
  document.addEventListener("click", documentActions)

  const iconMenu = document.querySelector('.icon-menu');

  const listMainMenu = document.querySelector('.menu__body');


  function documentActions(e) {

    const targetElement = e.target;

    if (window.innerWidth > 768 && isMobile.any()) {

      if (targetElement.classList.contains('menu__arrow')) {
        targetElement.closest('.menu__item').classList.toggle("_hover");
      }

      if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
        removeClasses(document.querySelectorAll('.menu__item._hover'), "_hover")
      }
    }

    if (targetElement.classList.contains('search-form__icon')) {
      document.querySelector('.search-form').classList.toggle('_active')
    } else if (!targetElement.closest('.search-form') && document.querySelector('.search-form._active')) {
      document.querySelector('.search-form').classList.remove('_active');
    }

    if (targetElement.closest('.icon-menu')) {
      iconMenu.classList.toggle('_active');
      listMainMenu.classList.toggle('_active');
    }
  }

  const headerELement = document.querySelector('.header');
  // шапка відносно екрану
  const headerMotionScroll = function (entries, observer) {
    if (entries[0].isIntersecting) {
      headerELement.classList.remove('_scroll');
    } else {
      headerELement.classList.add('_scroll');
    }

  }

  const headerObserver = new IntersectionObserver(headerMotionScroll);
  headerObserver.observe(headerELement);


  const spollers = document.querySelectorAll('[data-spollers]');


  if (spollers.length > 0) {

    spollers.forEach(spollersBlock => {

      const params = spollersBlock.dataset.spollers;
      const [widthValue, typeValue] = params.split(',');

      const mediaQuery = window.matchMedia(`(${typeValue}-width: ${widthValue}px)`);

      function initSpollers() {
        const spollerItem = spollersBlock.querySelectorAll('[data-spoller]');

        spollerItem.forEach(item => {
          item.addEventListener('click', function () {
            this.classList.toggle('active');
            const spollerText = this.nextElementSibling;
            if (spollerText.style.maxHeight) {
              spollerText.style.maxHeight = null;
            } else {
              spollerText.style.maxHeight = spollerText.scrollHeight + 'px';
            }
          });
        });
      }

      function handleMediaQuery(e) {
        if (e.matches) {
          initSpollers();
        }
      }
      if (mediaQuery.matches) {
        initSpollers();
      }
      mediaQuery.addEventListener("change", handleMediaQuery);
    });
  }



  function ibg() {
    let ibg = document.querySelectorAll('._ibg');
    for (let i = 0; i < ibg.length; i++) {
      if (ibg[i].querySelector('img')) {
        ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
      }
    }
  }

  ibg();
}


let formContainer = document.querySelector('.subscribe__form');
let btnSubmit = document.querySelector(".subscribe__button");
btnSubmit.addEventListener("click", validate);

// Регулярное выражение для тестирования корректности ввода
function validateEmail(email) {
  let emailRE = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return emailRE.test(String(email).toLowerCase());
}

// Форма отправки в случае ошибки, проверяем
function sendForm() {
  let emailInput = document.querySelector("._email");
  let email = emailInput.value;

  if (!validateEmail(email)) {
    let emailError = formContainer.querySelector('.form__error');
    if (!emailError) {
      emailError = document.createElement('div');
      emailError.setAttribute('class', 'form__error');
      emailError.innerText = "Error. Check the correctness of the email address";
      formContainer.appendChild(emailError);
    }
    formContainer.classList.add('subscribe-form__error');
  } else {
    let emailError = formContainer.querySelector('.form__error');
    if (emailError) {
      formContainer.removeChild(emailError);
      formContainer.classList.remove('subscribe-form__error');
    }
    let popup = document.querySelector('[data-popup="subscribe"]');
    popup.classList.add('popup_open');
    emailInput.value = ""; // Очистка поля ввода
  }
}

// Проверка мейл и отправка в случае коррекной валидации
function validate(event) {
  event.preventDefault();
  sendForm();
}

// Очистка ошибки при изменении содержимого поля ввода
formContainer.querySelector("._email").addEventListener("input", function () {
  let error = formContainer.querySelector('.form__error');
  if (error) {
    formContainer.removeChild(error);
    formContainer.classList.remove('form_error');
  }
});

// логика для popup
let popupCloseButtons = document.querySelectorAll('.popup__close');
popupCloseButtons.forEach(button => {
  button.addEventListener('click', function () {
    let popup = button.closest('.popup');
    popup.classList.remove('popup_open');
  });
});

// Получаем элемент футер-меню
const footerMenu = document.querySelector('.footer__menu');

// Функция для проверки размера экрана и добавления/удаления класса "init"
function checkScreenSize() {
  if (window.innerWidth <= 768) {
    footerMenu.classList.add('_init');
  } else {
    footerMenu.classList.remove('_init');
  }
}
// Вызываем функцию при загрузке страницы
checkScreenSize();

// Отслеживаем событие изменения размера окна
window.addEventListener('resize', checkScreenSize);



