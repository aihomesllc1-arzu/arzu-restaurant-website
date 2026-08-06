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
