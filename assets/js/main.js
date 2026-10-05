/* ==========================================================================
   Clear Chiropractic — site scripts
   Progressive enhancement only. Every form works without this file.
   ========================================================================== */
(function () {
  "use strict";

  var FORM_ENDPOINT =
    "https://vision.leadrai.com/api/forms/229c0adfd37c1e856d082f9cf10f9771";
  var CONFIRM_TITLE = "Thanks, your message was sent";
  var CONFIRM_BODY =
    "A member of the Clear Chiropractic team will be in touch shortly. Need us sooner? Call (619) 734-9327.";

  /* ---------------------------------------------------------------- header */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----------------------------------------------------------- mobile menu */
  function initMobileNav() {
    var drawer = document.getElementById("mobile-nav");
    var openBtn = document.querySelector(".nav__toggle");
    if (!drawer || !openBtn) return;

    var closeBtn = drawer.querySelector(".mobile-nav__close");
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      drawer.classList.add("is-open");
      openBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      drawer.classList.remove("is-open");
      openBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);

    drawer.addEventListener("click", function (event) {
      if (event.target === drawer) close();
      if (event.target.closest && event.target.closest("a")) close();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && drawer.classList.contains("is-open")) close();
    });
  }

  /* ------------------------------------------------------------- carousels */
  function initCarousels() {
    var carousels = document.querySelectorAll("[data-carousel]");
    Array.prototype.forEach.call(carousels, function (carousel) {
      var viewport = carousel.querySelector(".tcarousel__viewport");
      var prev = carousel.querySelector("[data-carousel-prev]");
      var next = carousel.querySelector("[data-carousel-next]");
      if (!viewport) return;

      function step() {
        var first = viewport.querySelector("li");
        var width = first ? first.getBoundingClientRect().width + 20 : viewport.clientWidth * 0.8;
        return Math.max(width, 240);
      }

      if (prev) {
        prev.addEventListener("click", function () {
          viewport.scrollBy({ left: -step(), behavior: "smooth" });
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          viewport.scrollBy({ left: step(), behavior: "smooth" });
        });
      }
    });
  }

  /* -------------------------------------------------------- scroll reveals */
  function initReveals() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    Array.prototype.forEach.call(items, function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------ year stamp */
  function initYear() {
    var nodes = document.querySelectorAll("[data-year]");
    var year = String(new Date().getFullYear());
    Array.prototype.forEach.call(nodes, function (node) {
      node.textContent = year;
    });
  }

  /* ----------------------------------------------------------------- forms */
  function showStatus(form, type, title, body) {
    var box = form.querySelector(".form-status");
    if (!box) return;
    box.className = "form-status is-visible form-status--" + type;
    box.setAttribute("role", type === "ok" ? "status" : "alert");
    box.innerHTML =
      '<span class="form-status__icon" aria-hidden="true">' +
      (type === "ok" ? "&#10003;" : "&#9888;") +
      "</span><p><strong></strong><span></span></p>";
    box.querySelector("strong").textContent = title;
    box.querySelector("span:last-child").textContent = body;
    try {
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      /* older browsers: no smooth scroll, nothing to do */
    }
  }

  function initForms() {
    var forms = document.querySelectorAll("form[data-leadr-form]");

    Array.prototype.forEach.call(forms, function (form) {
      /* Record the page the visitor submitted from. */
      var pageField = form.querySelector('input[name="_page"]');
      if (pageField) pageField.value = window.location.href;

      /* Guarantee the required endpoint even if markup is edited later. */
      if (form.getAttribute("action") !== FORM_ENDPOINT) {
        form.setAttribute("action", FORM_ENDPOINT);
      }

      form.addEventListener("submit", function (event) {
        if (typeof window.fetch !== "function" || typeof FormData !== "function") {
          return; /* fall back to the plain HTML POST */
        }

        event.preventDefault();

        var button = form.querySelector('button[type="submit"]');
        var originalLabel = button ? button.textContent : "";
        if (button) {
          button.disabled = true;
          button.textContent = "Sending…";
        }

        var payload = {};
        var data = new FormData(form);
        data.forEach(function (value, key) {
          if (Object.prototype.hasOwnProperty.call(payload, key)) {
            payload[key] = [].concat(payload[key], value).join(", ");
          } else {
            payload[key] = value;
          }
        });
        payload._page = window.location.href;

        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function (response) {
            return response
              .json()
              .catch(function () {
                return { ok: response.ok };
              })
              .then(function (json) {
                if (!response.ok || !json || json.ok !== true) {
                  throw new Error("Submission rejected");
                }
                form.reset();
                var reset = form.querySelector('input[name="_page"]');
                if (reset) reset.value = window.location.href;
                showStatus(form, "ok", CONFIRM_TITLE, CONFIRM_BODY);
              });
          })
          .catch(function () {
            showStatus(
              form,
              "error",
              "We couldn't send that just now.",
              "Please try again, or call us directly at (619) 734-9327 and we'll take care of you."
            );
          })
          .then(function () {
            if (button) {
              button.disabled = false;
              button.textContent = originalLabel;
            }
          });
      });
    });
  }

  /* Plain (no-JS) submissions come back with ?submitted=1 */
  function initSubmittedConfirmation() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("submitted") !== "1") return;

    var banner = document.getElementById("submitted-banner");
    if (banner) {
      banner.classList.add("is-visible");
      var dismiss = banner.querySelector("button");
      if (dismiss) {
        dismiss.addEventListener("click", function () {
          banner.classList.remove("is-visible");
        });
      }
    }

    var form = document.querySelector("form[data-leadr-form]");
    if (form) {
      showStatus(form, "ok", CONFIRM_TITLE, CONFIRM_BODY);
    }
  }

  function boot() {
    initHeader();
    initMobileNav();
    initCarousels();
    initReveals();
    initYear();
    initForms();
    initSubmittedConfirmation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
