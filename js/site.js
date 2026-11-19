/* Game page: screenshot lightbox + click-to-load YouTube trailer. No cookies, no tracking.
   Without JavaScript the page still works: screenshots open as plain images and the trailer
   button is a normal link to the video. */
(function () {
  "use strict";

  /* ---------- lightbox ---------- */
  var dialog = document.getElementById("lightbox");
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (dialog && typeof dialog.showModal === "function" && links.length) {
    var img = document.getElementById("lightbox-img");
    var cap = document.getElementById("lightbox-cap");
    var count = document.getElementById("lightbox-count");
    var index = 0;

    var show = function (i) {
      index = (i + links.length) % links.length;
      var a = links[index];
      img.src = a.getAttribute("href");
      img.alt = a.getAttribute("data-caption") || "";
      cap.textContent = a.getAttribute("data-caption") || "";
      count.textContent = (index + 1) + " / " + links.length;
    };

    links.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        show(i);
        dialog.showModal();
      });
    });

    dialog.addEventListener("click", function (e) {
      var action = e.target.getAttribute && e.target.getAttribute("data-lb");
      if (action === "prev") { show(index - 1); }
      else if (action === "next") { show(index + 1); }
      else if (action === "close" || e.target === dialog) { dialog.close(); }
    });

    document.addEventListener("keydown", function (e) {
      if (!dialog.open) { return; }
      if (e.key === "ArrowLeft") { show(index - 1); }
      if (e.key === "ArrowRight") { show(index + 1); }
    });

    var touchX = null;
    dialog.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener("touchend", function (e) {
      if (touchX === null) { return; }
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) { show(index + (dx < 0 ? 1 : -1)); }
      touchX = null;
    });

    dialog.addEventListener("close", function () { img.src = "data:,"; });
  }

  /* ---------- trailer: load YouTube (privacy-enhanced mode) only after a click ---------- */
  var yt = document.querySelector("[data-youtube]");
  if (yt) {
    yt.addEventListener("click", function (e) {
      e.preventDefault();
      var id = yt.getAttribute("data-youtube");
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0&modestbranding=1";
      frame.title = yt.getAttribute("aria-label") || "Trailer";
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      yt.parentNode.replaceChild(frame, yt);
    });
  }
})();
