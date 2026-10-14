// Sticky header border on scroll
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
});

// Mobile nav toggle
const toggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  });
});

// Order online dropdown (present on the Home page only)
const orderToggle = document.getElementById('order-toggle');
const orderDropdown = document.querySelector('.order-dropdown');
if (orderToggle && orderDropdown) {
  orderToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = orderDropdown.classList.toggle('open');
    orderToggle.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('click', (e) => {
    if (!orderDropdown.contains(e.target)) {
      orderDropdown.classList.remove('open');
      orderToggle.setAttribute('aria-expanded', false);
    }
  });
}

// Visitor tally (present on the Home page only) — a plain digit readout, no label
const tallyEl = document.getElementById('visitor-tally');
if (tallyEl) {
  fetch('https://abacus.jasoncameron.dev/hit/eat-arzu-com/homepage')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      const digits = String(data.value).padStart(4, '0').split('');
      tallyEl.innerHTML = digits.map(d => `<span class="tally-digit">${d}</span>`).join('');
    })
    .catch(() => { tallyEl.remove(); });
}

// Menu photo viewer (present on the Menu page only) — click a dish photo to enlarge it
const menuPhotos = [...document.querySelectorAll('.menu-item-photo')];
if (menuPhotos.length) {
  const box = document.createElement('dialog');
  box.className = 'lightbox';
  box.setAttribute('aria-label', 'Dish photo');

  const mk = (tag, cls, label) => {
    const el = document.createElement(tag);
    el.className = cls;
    if (label) el.setAttribute('aria-label', label);
    return el;
  };
  const closeBtn = mk('button', 'lightbox-close', 'Close');
  closeBtn.textContent = '×';
  const prevBtn = mk('button', 'lightbox-nav lightbox-prev', 'Previous dish');
  prevBtn.textContent = '‹';
  const nextBtn = mk('button', 'lightbox-nav lightbox-next', 'Next dish');
  nextBtn.textContent = '›';
  const figure = mk('figure', 'lightbox-figure');
  const bigImg = mk('img', 'lightbox-img');
  const caption = mk('figcaption', 'lightbox-caption');
  const capName = mk('span', 'lightbox-name');
  const capPrice = mk('span', 'lightbox-price');
  caption.append(capName, capPrice);
  figure.append(bigImg, caption);
  box.append(closeBtn, prevBtn, figure, nextBtn);
  document.body.append(box);

  const isBroken = (p) => p.complete && p.naturalWidth === 0;
  let current = -1;
  let opener = null;

  const show = (i) => {
    current = i;
    const photo = menuPhotos[i];
    const card = photo.closest('.menu-item');
    bigImg.src = photo.currentSrc || photo.src;
    bigImg.alt = photo.alt;
    capName.textContent = card?.querySelector('.menu-item-name')?.textContent ?? photo.alt;
    capPrice.textContent = card?.querySelector('.menu-item-price')?.textContent ?? '';
  };
  const step = (dir) => {
    for (let n = 1; n <= menuPhotos.length; n++) {
      const i = (current + dir * n + menuPhotos.length * n) % menuPhotos.length;
      if (!isBroken(menuPhotos[i])) { show(i); return; }
    }
  };

  menuPhotos.forEach((photo, i) => {
    photo.tabIndex = 0;
    photo.setAttribute('role', 'button');
    photo.setAttribute('aria-label', `View larger: ${photo.alt}`);
    const open = () => {
      if (isBroken(photo)) return;
      opener = photo;
      show(i);
      box.showModal();
    };
    photo.addEventListener('click', open);
    photo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  closeBtn.addEventListener('click', () => box.close());
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  // clicking the dark area around the photo closes it
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  box.addEventListener('close', () => { bigImg.removeAttribute('src'); opener?.focus(); });
}
