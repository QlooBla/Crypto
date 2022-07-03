(() => {
  "use strict";
  function isWebp() {
    function testWebP(callback) {
      let webP = new Image();
      webP.onload = webP.onerror = function () {
        callback(2 == webP.height);
      };
      webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    testWebP(function (support) {
      let className = true === support ? "webp" : "no-webp";
      document.documentElement.classList.add(className);
    });
  }
  let bodyLockStatus = true;
  let bodyLockToggle = (delay = 500) => {
    if (document.documentElement.classList.contains("lock")) bodyUnlock(delay);
    else bodyLock(delay);
  };
  let bodyUnlock = (delay = 500) => {
    let body = document.querySelector("body");
    if (bodyLockStatus) {
      let lock_padding = document.querySelectorAll("[data-lp]");
      setTimeout(() => {
        for (let index = 0; index < lock_padding.length; index++) {
          const el = lock_padding[index];
          el.style.paddingRight = "0px";
        }
        body.style.paddingRight = "0px";
        document.documentElement.classList.remove("lock");
      }, delay);
      bodyLockStatus = false;
      setTimeout(function () {
        bodyLockStatus = true;
      }, delay);
    }
  };
  let bodyLock = (delay = 500) => {
    let body = document.querySelector("body");
    if (bodyLockStatus) {
      let lock_padding = document.querySelectorAll("[data-lp]");
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight =
          window.innerWidth -
          document.querySelector(".wrapper").offsetWidth +
          "px";
      }
      body.style.paddingRight =
        window.innerWidth -
        document.querySelector(".wrapper").offsetWidth +
        "px";
      document.documentElement.classList.add("lock");
      bodyLockStatus = false;
      setTimeout(function () {
        bodyLockStatus = true;
      }, delay);
    }
  };
  function menuInit() {
    if (document.querySelector(".icon-menu"))
      document.addEventListener("click", function (e) {
        if (bodyLockStatus && e.target.closest(".icon-menu")) {
          bodyLockToggle();
          document.documentElement.classList.toggle("menu-open");
        }
      });
  }
  let addWindowScrollEvent = false;
  function headerScroll() {
    addWindowScrollEvent = true;
    const header = document.querySelector("header.header");
    const headerShow = header.hasAttribute("data-scroll-show");
    const headerShowTimer = header.dataset.scrollShow
      ? header.dataset.scrollShow
      : 500;
    const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
    let scrollDirection = 0;
    let timer;
    document.addEventListener("windowScroll", function (e) {
      const scrollTop = window.scrollY;
      clearTimeout(timer);
      if (scrollTop >= startPoint) {
        !header.classList.contains("_header-scroll")
          ? header.classList.add("_header-scroll")
          : null;
        if (headerShow) {
          if (scrollTop > scrollDirection)
            header.classList.contains("_header-show")
              ? header.classList.remove("_header-show")
              : null;
          else
            !header.classList.contains("_header-show")
              ? header.classList.add("_header-show")
              : null;
          timer = setTimeout(() => {
            !header.classList.contains("_header-show")
              ? header.classList.add("_header-show")
              : null;
          }, headerShowTimer);
        }
      } else {
        header.classList.contains("_header-scroll")
          ? header.classList.remove("_header-scroll")
          : null;
        if (headerShow)
          header.classList.contains("_header-show")
            ? header.classList.remove("_header-show")
            : null;
      }
      scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
    });
  }
  setTimeout(() => {
    if (addWindowScrollEvent) {
      let windowScroll = new Event("windowScroll");
      window.addEventListener("scroll", function (e) {
        document.dispatchEvent(windowScroll);
      });
    }
  }, 0);
  function DynamicAdapt(type) {
    this.type = type;
  }
  DynamicAdapt.prototype.init = function () {
    const _this = this;
    this.оbjects = [];
    this.daClassname = "_dynamic_adapt_";
    this.nodes = document.querySelectorAll("[data-da]");
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const data = node.dataset.da.trim();
      const dataArray = data.split(",");
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(dataArray[0].trim());
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
      оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    }
    this.arraySort(this.оbjects);
    this.mediaQueries = Array.prototype.map.call(
      this.оbjects,
      function (item) {
        return (
          "(" +
          this.type +
          "-width: " +
          item.breakpoint +
          "px)," +
          item.breakpoint
        );
      },
      this
    );
    this.mediaQueries = Array.prototype.filter.call(
      this.mediaQueries,
      function (item, index, self) {
        return Array.prototype.indexOf.call(self, item) === index;
      }
    );
    for (let i = 0; i < this.mediaQueries.length; i++) {
      const media = this.mediaQueries[i];
      const mediaSplit = String.prototype.split.call(media, ",");
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];
      const оbjectsFilter = Array.prototype.filter.call(
        this.оbjects,
        function (item) {
          return item.breakpoint === mediaBreakpoint;
        }
      );
      matchMedia.addListener(function () {
        _this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    }
  };
  DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
    if (matchMedia.matches)
      for (let i = 0; i < оbjects.length; i++) {
        const оbject = оbjects[i];
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      }
    else
      for (let i = оbjects.length - 1; i >= 0; i--) {
        const оbject = оbjects[i];
        if (оbject.element.classList.contains(this.daClassname))
          this.moveBack(оbject.parent, оbject.element, оbject.index);
      }
  };
  DynamicAdapt.prototype.moveTo = function (place, element, destination) {
    element.classList.add(this.daClassname);
    if ("last" === place || place >= destination.children.length) {
      destination.insertAdjacentElement("beforeend", element);
      return;
    }
    if ("first" === place) {
      destination.insertAdjacentElement("afterbegin", element);
      return;
    }
    destination.children[place].insertAdjacentElement("beforebegin", element);
  };
  DynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);
    if (void 0 !== parent.children[index])
      parent.children[index].insertAdjacentElement("beforebegin", element);
    else parent.insertAdjacentElement("beforeend", element);
  };
  DynamicAdapt.prototype.indexInParent = function (parent, element) {
    const array = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(array, element);
  };
  DynamicAdapt.prototype.arraySort = function (arr) {
    if ("min" === this.type)
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) return 0;
          if ("first" === a.place || "last" === b.place) return -1;
          if ("last" === a.place || "first" === b.place) return 1;
          return a.place - b.place;
        }
        return a.breakpoint - b.breakpoint;
      });
    else {
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) return 0;
          if ("first" === a.place || "last" === b.place) return 1;
          if ("last" === a.place || "first" === b.place) return -1;
          return b.place - a.place;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  };
  const da = new DynamicAdapt("max");
  da.init();
  const bodyEl = document.querySelector(".animation");
  bodyEl.addEventListener("mousemove", (evt) => {
    const mouseX = evt.clientX;
    const mouseY = evt.clientY - 300;
    gsap.set(".cursor", {
      x: mouseX,
      y: mouseY,
    });
    gsap.to(".animation__shape", {
      x: mouseX,
      y: mouseY,
      stagger: -0.1,
    });
  });
  let box = document.querySelectorAll(".speakers__item");
  let btn = document.querySelector("#button");
  for (let i = 5; i < box.length; i++) {
    box[i].style.display = "none";
    console.log("yas");
  }
  let countD = 5;
  btn.addEventListener("click", function () {
    console.log("нажал");
    let box = document.querySelectorAll(".speakers__item");
    countD += 5;
    if (countD <= box.length)
      for (let i = 0; i < countD; i++) box[i].style.display = "block";
  });

  window["FLS"] = true;
  isWebp();
  menuInit();
  headerScroll();
})();
//ОБРАТНЫЙ ОТСЧЁТ
const deadLine = new Date(2022, 07, 01); //Ставим дату, до которой будет идти отсчёт (год, месяц, день)
let timerId = null;
function countdownTimer() {
  const diff = deadLine - new Date();
  if (diff <= 0) {
    clearInterval(timerId);
  }
  const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0;
  const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
  const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
  const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;

  $days.textContent = days < 10 ? "0" + days : days;
  $hours.textContent = hours < 10 ? "0" + hours : hours;
  $minutes.textContent = minutes < 10 ? "0" + minutes : minutes;
  $seconds.textContent = seconds < 10 ? "0" + seconds : seconds;
}
const $days = document.querySelector(".times-days");
const $hours = document.querySelector(".times-hours");
const $minutes = document.querySelector(".times-minutes");
const $seconds = document.querySelector(".times-seconds");
countdownTimer();
timerId = setInterval(countdownTimer, 1000);
