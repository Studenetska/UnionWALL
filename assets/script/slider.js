document.addEventListener('DOMContentLoaded', function () {
  let mainSliders = document.querySelectorAll('.slider-main__body');
  mainSliders.forEach((slider) => {
    new Swiper(slider, {
      direction: 'horizontal',
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: 32,
      watchOverflow: true,
      speed: 800,
      loop: true,

      // initialSlide: 1,
      loopAdditionalSlides: 5,
      preloadImages: false,
      parallax: true,
      // Dotts
      pagination: {
        el: slider.closest('.slider-main').querySelector('.controls-slider-main__dotts'),
        clickable: true,
      },
      // Arrows
      navigation: {
        nextEl: slider.closest('.slider-main').querySelector('.slider-arrow__next'),
        prevEl: slider.closest('.slider-main').querySelector('.slider-arrow__prev'),
      },
    });
  });

  let sliderScrollItems = document.querySelectorAll('._swiper_scroll');
  sliderScrollItems.forEach((sliderScrollItem) => {
    let sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
    let sliderScroll = new Swiper(sliderScrollItem, {
      direction: 'vertical',
      slidesPerView: 'auto',
      freeMode: true,
      scrollbar: {
        el: sliderScrollBar,
        draggable: true,
        snapOnRelease: false,
      },
      mousewheel: {
        releaseOnEdges: true,
      },
    });
    sliderScroll.scrollbar.updateSize();
  });
});

export function removeClasses(elements, className) {
  elements.forEach(function (element) {
    element.classList.remove(className);
  });
}

// Динамическое применение
(function () {
  let originalPositions = [];
  let daElements = document.querySelectorAll('[data-da]');
  let daElementsArray = [];
  let daMatchMedia = [];
  //Заполняем массивы
  if (daElements.length > 0) {
    let number = 0;
    for (let index = 0; index < daElements.length; index++) {
      const daElement = daElements[index];
      const daMove = daElement.getAttribute('data-da');
      const daPlace = daElement.hasAttribute('data-da-position') ? daElement.getAttribute('data-da-position') : 'last';
      const daResolutionBreakpoint = daElement.hasAttribute('data-da-resolution') ? daElement.getAttribute('data-da-resolution') : 768;
      daElement.setAttribute('data-da-index', number);
      //Заполняем массив первоначальных позиций
      originalPositions[number] = {
        "parent": daElement.parentNode,
        "index": indexInParent(daElement)
      };
      //Заполняем массив элементов
      daElementsArray[number] = {
        "element": daElement,
        "destination": document.querySelector('.' + daMove),
        "place": daPlace,
        "breakpoint": daResolutionBreakpoint
      }
      number++;
    }
    dynamicAdaptSort(daElementsArray);

    //Создаем события в точке брейпоинта
    for (let index = 0; index < daElementsArray.length; index++) {
      const el = daElementsArray[index];
      const daBreakpoint = el.breakpoint;
      const daType = "max"; //Для MobileFirst поменять на min

      daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
      daMatchMedia[index].addListener(dynamicAdapt);
    }
  }
  //Основная функция
  function dynamicAdapt(e) {
    for (let index = 0; index < daElementsArray.length; index++) {
      const el = daElementsArray[index];
      const daElement = el.element;
      const daDestination = el.destination;
      const daPlace = el.place;
      const daBreakpoint = el.breakpoint;
      const daClassname = "_dynamic_adapt_" + daBreakpoint;

      if (daMatchMedia[index].matches) {
        //Перебрасываем элементы
        if (!daElement.classList.contains(daClassname)) {
          let actualIndex = indexOfElements(daDestination)[daPlace];
          if (daPlace == 'first') {
            actualIndex = indexOfElements(daDestination)[0];
          } else if (daPlace == 'last') {
            actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
          }
          daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
          daElement.classList.add(daClassname);
        }
      } else {
        //Возвращаем на место
        if (daElement.classList.contains(daClassname)) {
          dynamicAdaptBack(daElement);
          daElement.classList.remove(daClassname);
        }
      }
    }
    customAdapt();
  }

  //Вызов основной функции
  dynamicAdapt();

  //Функция возврата на место
  function dynamicAdaptBack(el) {
    const daIndex = el.getAttribute('data-da-index');
    const originalPlace = originalPositions[daIndex];
    const parentPlace = originalPlace['parent'];
    const indexPlace = originalPlace['index'];
    const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
    parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
  }
  //Функция получения индекса внутри родителя
  function indexInParent(el) {
    var children = Array.prototype.slice.call(el.parentNode.children);
    return children.indexOf(el);
  }
  //Функция получения массива индексов элементов внутри родителя
  function indexOfElements(parent, back) {
    const children = parent.children;
    const childrenArray = [];
    for (let i = 0; i < children.length; i++) {
      const childrenElement = children[i];
      if (back) {
        childrenArray.push(i);
      } else {
        //Исключая перенесенный элемент
        if (childrenElement.getAttribute('data-da') == null) {
          childrenArray.push(i);
        }
      }
    }
    return childrenArray;
  }
  //Сортировка объекта
  function dynamicAdaptSort(arr) {
    arr.sort(function (a, b) {
      if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 } //Для MobileFirst поменять
    });
    arr.sort(function (a, b) {
      if (a.place > b.place) { return 1 } else { return -1 }
    });
  }
  //Дополнительные сценарии адаптации
  function customAdapt() {
    const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }

}());