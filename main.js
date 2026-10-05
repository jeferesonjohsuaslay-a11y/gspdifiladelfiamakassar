document.addEventListener('DOMContentLoaded', () => {
  // Update tahun di footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Navbar menjadi gelap saat scroll
  const nav = document.querySelector('.navbar');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // menu mobile tutup setelah link diklik
  const menu = document.getElementById('menu');
  if (menu) {
    document.querySelectorAll('#menu .nav-link').forEach(l =>
      l.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(menu);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      })
    );
  }

  // Teks berjalan di bawah hero
  const track = document.getElementById('track');
  if (track) {
    const item = '<span>Filadelfia - Kasih Persaudaraan</span><i></i><span>Kasih Persaudaraan - Filadelfia</span><i></i>';
    track.innerHTML = item.repeat(12);
  }

  // Tombol panah carousel pelayanan
  const rail = document.getElementById('rail');
  if (rail) {
    document.querySelectorAll('[data-dir]').forEach(b =>
      b.addEventListener('click', () => rail.scrollBy({ left: b.dataset.dir * 320, behavior: 'smooth' }))
    );
  }
});

/* foto ganti otomtis di pelayanan kitta*/
document.querySelectorAll('.mcard[data-folder]').forEach(function (card, i) {
  var bg = card.querySelector('.mcard-bg');
  var folder = card.dataset.folder;
  var total = parseInt(card.dataset.jumlah, 10) || 1;
  var ext = card.dataset.ext || 'jpg';
  var jeda = 5000; // 5 detik per foto

  var layers = [document.createElement('span'), document.createElement('span')];
  layers.forEach(function (l) { bg.appendChild(l); });

  var n = 1;        // nomor foto yang sedang tampil
  var aktif = 0;    // lapisan yang sedang tampil

  function src(no) { return folder + '/' + no + '.' + ext; }

function tampil(no) {
  var lain = 1 - aktif;
  if (card.classList.contains('mcard-lh')) {
    layers[lain].innerHTML =
      '<img class="lh-blur" src="' + src(no) + '" alt="">' +
      '<img class="lh-full" src="' + src(no) + '" alt="">';
  } else {
    layers[lain].style.backgroundImage = "url('" + src(no) + "')";
  }
  layers[lain].classList.add('on');
  layers[aktif].classList.remove('on');
  aktif = lain;
}

  tampil(n);

  // matur jeda antar foto
  setTimeout(function () {
    setInterval(function () {
      n = (n % total) + 1;
      new Image().src = src((n % total) + 1); // muat foto berikutnya lebih dulu
      tampil(n);
    }, jeda);
  }, i * 800);
});

/* Animasi muncul saat scroll */
document.addEventListener('DOMContentLoaded', function () {
  var targets = document.querySelectorAll(
    'section h2, .block, .verse, .who, .soc, .gembala-card-index, footer .row > div'
  );

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('sr-in');
      io.unobserve(e.target);
      // hapus jeda setelah muncul supaya efek hover tidak ikut tertunda
      setTimeout(function () { e.target.style.transitionDelay = ''; }, 1200);
    });
  }, { threshold: 0.15 });

  targets.forEach(function (el) {
    el.classList.add('sr');
    var idx = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.transitionDelay = (idx % 4) * 120 + 'ms';   // muncul berurutan
    io.observe(el);
  });
});

// tombol panah sorotan
function scrollSorotan(direction) {
  const rail = document.getElementById('sorotanRail');
  if (rail) {
    const scrollAmount = 400; // jarak scroll per klik
    rail.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
}

/* ===== Carousel Sorotan melingkar ===== */
(function () {
  const rail = document.getElementById('sorotanRail');
  if (!rail) return;

  const asli = Array.from(rail.children);
  const n = asli.length;
  if (n < 2) return;

  // gandakan kartu: set "sebelum" dan set "sesudah"
  const sebelum = document.createDocumentFragment();
  const sesudah = document.createDocumentFragment();
  asli.forEach(function (c) {
    [sebelum, sesudah].forEach(function (frag) {
      const k = c.cloneNode(true);
      k.setAttribute('aria-hidden', 'true');
      frag.appendChild(k);
    });
  });
  rail.insertBefore(sebelum, rail.firstChild);
  rail.appendChild(sesudah);

  // lebar satu set kartu (termasuk jarak antar kartu)
  function lebarSet() {
    return rail.children[n].getBoundingClientRect().left - rail.children[0].getBoundingClientRect().left;
  }

  // loncat tanpa animasi
  function loncat(x) {
    rail.style.scrollSnapType = 'none';
    rail.style.scrollBehavior = 'auto';
    rail.scrollLeft = x;
    requestAnimationFrame(function () {
      rail.style.scrollSnapType = '';
      rail.style.scrollBehavior = '';
    });
  }

  // jaga posisi tetap di set tengah
  function normalisasi() {
    const W = lebarSet();
    const x = rail.scrollLeft;
    if (x < W - 2) loncat(x + W);
    else if (x >= 2 * W - 2) loncat(x - W);
  }

  // mulai dari set tengah
  loncat(lebarSet());
  window.addEventListener('load', function () { loncat(lebarSet()); });
  window.addEventListener('resize', normalisasi);

  // normalisasi setelah geseran berhenti (tombol, sentuhan, atau mouse)
  let timer;
  rail.addEventListener('scroll', function () {
    clearTimeout(timer);
    timer = setTimeout(normalisasi, 120);
  });
})();

function scrollSorotan(dir) {
  const rail = document.getElementById('sorotanRail');
  if (!rail) return;

  const card = rail.querySelector('.sorotan-card');
  const gap = parseFloat(getComputedStyle(rail).gap) || 16;
  rail.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
}