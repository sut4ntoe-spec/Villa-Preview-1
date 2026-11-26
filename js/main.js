/* Hening — interactions. Vanilla JS, IntersectionObserver for reveals.
   setupReveal/setupGallery are re-run after content-loader.js rebuilds
   the villas/gallery/philosophy grids from data/content.json. */
(() => {
  'use strict';

  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile drawer */
  const menuBtn = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const openDrawer = () => {
    drawer.classList.add('open'); backdrop.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    drawer.classList.remove('open'); backdrop.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  menuBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  /* ---------- Scroll reveal (re-runnable: skips elements already observed) ---------- */
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('is-visible'), Number(delay));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) : null;

  function setupReveal() {
    const revealEls = document.querySelectorAll('.reveal:not([data-observed])');
    revealEls.forEach(el => {
      el.setAttribute('data-observed', '1');
      if (io) io.observe(el);
      else el.classList.add('is-visible');
    });
  }
  setupReveal();

  /* ---------- Lightbox gallery (re-runnable: re-reads [data-gallery-item] list) ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  let galleryItems = [];
  let currentIndex = 0;

  const showImage = (index) => {
    if (!galleryItems.length) return;
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const el = galleryItems[currentIndex];
    lightboxImg.style.opacity = 0;
    requestAnimationFrame(() => {
      lightboxImg.src = el.dataset.full || el.src;
      lightboxImg.alt = el.alt;
      lightboxCaption.textContent = el.alt;
      lightboxImg.style.opacity = 1;
    });
  };

  function setupGallery() {
    galleryItems = Array.from(document.querySelectorAll('[data-gallery-item]'));
    galleryItems.forEach((img, i) => {
      img.replaceWith(img.cloneNode(true)); // strip old listeners before rebinding
    });
    galleryItems = Array.from(document.querySelectorAll('[data-gallery-item]'));
    galleryItems.forEach((img, i) => {
      img.addEventListener('click', () => {
        showImage(i);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        lightbox.querySelector('.lightbox-close')?.focus();
      });
    });
  }
  setupGallery();

  document.getElementById('lightbox-prev')?.addEventListener('click', () => showImage(currentIndex - 1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => showImage(currentIndex + 1));
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  function closeLightbox() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  });

  /* Re-scan after content-loader.js rebuilds villas/gallery/philosophy grids */
  window.addEventListener('hening:content-applied', () => {
    setupReveal();
    setupGallery();
  });

  /* Testimonial carousel */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let activeSlide = 0;
  const goToSlide = (i) => {
    activeSlide = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle('hidden', idx !== activeSlide));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === activeSlide));
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
  if (slides.length) goToSlide(0);

  /* Newsletter form */
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('newsletter-success').classList.remove('hidden');
    newsletterForm.classList.add('hidden');
  });

  /* Booking / contact form */
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('contact-success').classList.remove('hidden');
    contactForm.classList.add('hidden');
  });

  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
