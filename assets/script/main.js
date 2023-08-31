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

    // для загрузки объектов из json отлавливаем клик на кнопке
    if (targetElement.classList.contains('products__more')) {
      getProducts(targetElement);
      // пишем чтобы не перезагружалась страница
      e.preventDefault();
    }

    // добавляем товары в корзину
    if (targetElement.classList.contains('actions-product__button')) {
      const productId = targetElement.closest('.item-product').dataset.pid;
      addToCart(targetElement, productId);
      e.preventDefault()
    }

    if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
      if (document.querySelector('.cart-list').children.length > 0) {
        document.querySelector('.cart-header').classList.toggle('_active');
      }
      e.preventDefault();
    } else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
      document.querySelector('.cart-header')
    }

    if (targetElement.classList.contains('cart-list__delete')) {
      const productID = targetElement.closest('.cart-list__item').dataset.cartPid;
      updateCart(targetElement, productID, false);
      e.preventDefault();
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

  // подргружаем больше продуктов
  async function getProducts(button) {
    if (!button.classList.contains('_hold')) {
      button.classList.add('_hold');
      const file = "./assets/json/products.json";
      let response = await fetch(file, {
        method: "GET"
      });
      if (response.ok) {
        let result = await response.json();
        loadProducts(result);
        button.classList.remove('_hold');
        button.remove();
      } else {
        alert('Error');
      }
    }
  }

  function loadProducts(data) {
    const productsItems = document.querySelector(".products__items");

    data.products.forEach(item => {
      const productID = item.id;
      const productUrl = item.url;
      const productImage = item.image;
      const productTitle = item.title;
      const productText = item.text;
      const productPrice = item.price;
      const productOldPrice = item.priceOld;
      const productShareUrl = item.shareUrl;
      const productLikeUrl = item.likeUrl;
      const productLabels = item.labels;

      let productTemplateStart = `<article data-pid="${productID}" class="products__item item-product">`;
      let productTemplateEnd = `</article>`;

      let productTemplateLabel = ``;
      if (productLabels) {
        let productTemplateLabelStart = `<div class="item-product__labels">`;
        let productTemplateLabelEnd = `</div>`;
        let productTemplateLabelContent = '';

        productLabels.forEach(labelItem => {
          productTemplateLabelContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`
        });

        productTemplateLabel += productTemplateLabelStart;
        productTemplateLabel += productTemplateLabelContent;
        productTemplateLabel += productTemplateLabelEnd;

      }

      let productTemplateImage = `
      <a href="${productUrl}" class="item-product__image _ibg">
      <img src="assets/img/products/${productImage}" alt="${productTitle}">
    </a>
    `;

      let productTemplateBodyStart = `<div class="item-product__body">`;
      let productTemplateBodyEnd = `</div>`;

      let productTemplateContent = `
      <div class="item-product__content">
      <h3 class="item-product__title">${productTitle}</h3>
      <div class="item-product__text">${productText}</div>
    </div>
    `;

      let productTemplatePrices = '';
      let productTemplatePricesStart = `<div class="item-product__prices">`;
      let productTemplatePricesCurrent = `<div class="item-product__price">€ ${productPrice}</div>`;
      let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">€ ${productOldPrice}</div>`;
      let productTemplatePricesEnd = `</div>`;

      productTemplatePrices = productTemplatePricesStart;
      productTemplatePrices += productTemplatePricesCurrent;
      if (productOldPrice) {
        productTemplatePrices += productTemplatePricesOld;
      }
      productTemplatePrices += productTemplatePricesEnd;

      let productTemplateActions = `
        <div class="item-product__actions actions-product">
          <div class="actions-product__body">
            <a href="" class="actions-product__button btn btn_white">Add to cart</a>
            <a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
            <a href="${productLikeUrl}" class="actions-product__link _icon-favorite">Like</a>
          </div>
        </div>
    `

      let productTemplateBody = '';
      productTemplateBody += productTemplateBodyStart;
      productTemplateBody += productTemplateContent;
      productTemplateBody += productTemplatePrices;
      productTemplateBody += productTemplateActions;
      productTemplateBody += productTemplateBodyEnd;

      let productTemplate = '';
      productTemplate += productTemplateStart;
      productTemplate += productTemplateLabel;
      productTemplate += productTemplateImage;
      productTemplate += productTemplateBody;
      productTemplate += productTemplateEnd;

      productsItems.insertAdjacentHTML('beforeend', productTemplate);
    });

    // вызов технического класса .ibg
    ibg();
  }

  //! функция добавления товаров в корзину c эффектом полета
  function addToCart(productButton, productId) {
    if (!productButton.classList.contains('_hold')) {
      productButton.classList.add('_hold');
      productButton.classList.add('_fly');

      const cart = document.querySelector('.cart-header__icon');
      const product = document.querySelector(`[data-pid="${productId}"]`)
      const productImage = product.querySelector('.item-product__image');

      //создаем для эффекта полета товара в корзину, для этого клонируем объект
      const productImageFly = productImage.cloneNode(true);

      // ширина и высота оригинальной картинки
      const productImageFlyWidth = productImage.offsetWidth;
      const productImageFlyHeight = productImage.offsetHeight;
      // позиция сверху и слева getBoundingClientRect() - по умолчанию метод
      const productImageFlyTop = productImage.getBoundingClientRect().top;
      const productImageFlyLeft = productImage.getBoundingClientRect().left;

      // применим все размеры для клона
      productImageFly.setAttribute('class', '_flyImage');
      productImageFly.style.cssText =
        `
        left: ${productImageFlyLeft}px;
        top: ${productImageFlyTop}px;
        width: ${productImageFlyWidth}px;
        height: ${productImageFlyHeight}px;
        `;

      document.body.append(productImageFly);

      const cartFlyLeft = cart.getBoundingClientRect().left;
      const cartFlyTop = cart.getBoundingClientRect().top;

      // благодаря этому картинка будет улетать вправо уменьшаться и прозрачность к 100% увеличивается
      productImageFly.style.cssText =
        `left: ${cartFlyLeft}px;
          top: ${cartFlyTop}px;
          width: 0;
          height: 0;
          opacity: 0;
        `;

      // нужно выводить количество в корзине после того как клон туда долетит
      productImageFly.addEventListener("transitionend", function () {
        if (productButton.classList.contains('_fly')) {
          // удаляем долетевший клон до корзины
          productImageFly.remove();
          updateCart(productButton, productId);
          productButton.classList.remove('_fly');
        }
      });

    }

  }

  function updateCart(productButton, productId, productAdd = true) {
    const cart = document.querySelector('.cart-header');
    const cartIcon = cart.querySelector('.cart-header__icon');
    const cartQuantity = cartIcon.querySelector('span');
    const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
    const cartList = document.querySelector('.cart-list');

    // добавляем товар
    if (productAdd) {
      if (cartQuantity) {
        cartQuantity.innerHTML = ++cartQuantity.innerHTML;
      } else {
        cartIcon.insertAdjacentHTML("beforeend", `<span>1</span>`);
      }

      // при нажатии будет выпадать список добавленных товаров
      if (!cartProduct) {
        const product = document.querySelector(`[data-pid="${productId}"]`);
        const cartProductImage = product.querySelector('.item-product__image').innerHTML;
        const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
        const cartProductContent = `
        <a href="" class="cart-list__image _ibg">${cartProductImage}</a>
        <div class="cart-list__body">
          <a href="" class="cart-list__title">${cartProductTitle}</a>
          <div class="cart-list__quantity">Quantity: <span>1</span></div>
          <a href="" class="cart-list__delete">Delete</a>
        </div>`;
        cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`)
        ibg();
      } else {
        const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
        cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
      }

      // добавляем возможность повторно выбирать товары
      productButton.classList.remove("_hold");
    } else {
      // для удаления товара из корзины
      // получаю количество добавленного товара
      const cartProductQuantity = cartProduct.querySelector(".cart-list__quantity span");
      // на единицу товар уменьшаем
      cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
      // результат 0 - удаляем товар из корзины
      if (!parseInt(cartProductQuantity.innerHTML)) {
        cartProduct.remove()
      }

      // уменьшаем на 1 общее количество товара
      const cartQuantityValue = --cartQuantity.innerHTML;

      // количество больше 0, значит уменьшаем количество
      if (cartQuantityValue) {
        cartQuantity.innerHTML = cartQuantityValue;
      } else {
        // если 0, удаляем класс active и спан с числами
        cartQuantity.remove();
        cart.classList.remove('_active');
      }
    }
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



