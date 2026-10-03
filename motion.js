/* BrainQraft landing — motion layer. À charger en fin de <body>, avec motion.css. */
(function () {
  var d = document;
  var page = d.querySelector(".page");

  /* Titre : un span par mot pour l'apparition en cascade */
  var title = d.querySelector(".title");
  if (title && !title.querySelector(".w")) {
    var text = title.textContent.trim();
    var words = text.split(/\s+/);
    title.setAttribute("aria-label", text);
    title.textContent = "";
    words.forEach(function (word, i) {
      var s = d.createElement("span");
      s.className = "w" + (/BrainQraft/.test(word) ? " w--brand" : "");
      s.style.setProperty("--i", i);
      s.setAttribute("aria-hidden", "true");
      s.textContent = word;
      title.appendChild(s);
      if (i < words.length - 1) title.appendChild(d.createTextNode(" "));
    });
  }

  /* Braseros : le SVG passe en ligne pour animer la flamme seule */
  d.querySelectorAll('.island__art img[src*="part-33"], .island__art img[src*="part-35"]').forEach(function (img, n) {
    fetch(img.getAttribute("src"))
      .then(function (r) { return r.text(); })
      .then(function (txt) {
        txt = txt.replace(/filter0_g_\w+/g, "bq-brazier-filter-" + n);
        var svg = new DOMParser().parseFromString(txt, "image/svg+xml").documentElement;
        if (!svg || svg.nodeName !== "svg") return;
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        var flame = svg.querySelector('path[fill="#DE8F3E"]');
        if (flame) {
          flame.setAttribute("class", "bq-flame");
          var core = flame.cloneNode(false);
          core.removeAttribute("id");
          core.setAttribute("fill", "#F6C453");
          core.setAttribute("class", "bq-flame bq-flame--core");
          flame.parentNode.insertBefore(core, flame.nextSibling);
        }
        var host = img.parentNode;
        host.classList.add("bq-brazier");
        host.replaceChild(d.importNode(svg, true), img);
        for (var i = 0; i < 4; i++) {
          var e = d.createElement("i");
          e.className = "bq-ember";
          e.style.setProperty("--i", i);
          host.appendChild(e);
        }
      })
      .catch(function () {});
  });

  /* Parallaxe légère à la souris */
  if (page && matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    var tick = function () {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      page.style.setProperty("--mx", cx.toFixed(3));
      page.style.setProperty("--my", cy.toFixed(3));
      raf = Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    addEventListener("pointermove", function (ev) {
      tx = (ev.clientX / innerWidth) * 2 - 1;
      ty = (ev.clientY / innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }
})();
