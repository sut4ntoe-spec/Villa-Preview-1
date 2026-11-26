/* Hening — loads data/content.json and populates the page.
   This lets the site's text/images be edited via admin.html without touching index.html. */
(() => {
  'use strict';

  fetch('data/content.json', { cache: 'no-store' })
    .then(res => res.json())
    .then(applyContent)
    .catch(err => console.warn('content-loader: could not load data/content.json', err));

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  function applyContent(content) {
    const { brand, hero, philosophy, villasSection, villas, gallerySection, gallery, standard, testimonials, location, contact, newsletter } = content;

    /* Brand */
    if (brand) {
      setText('nav-brand-name', brand.name);
      setText('footer-brand-name', brand.name);
      setText('footer-tagline', brand.tagline);
      setText('footer-address', brand.address);
      setText('footer-phone', brand.phone);
      setText('footer-email', brand.email);
      if (brand.name) document.title = document.title.replace(/^[^|]+/, brand.name + ' ');
    }

    /* Hero */
    if (hero) {
      setText('hero-eyebrow', hero.eyebrow);
      setText('hero-title', hero.title);
      setText('hero-subtitle', hero.subtitle);
      setText('hero-cta', hero.ctaText);
      const heroBg = document.getElementById('hero-bg');
      if (heroBg && hero.backgroundImage) heroBg.style.backgroundImage = `url('${hero.backgroundImage}')`;
    }

    /* Philosophy */
    if (philosophy) {
      setText('philosophy-eyebrow', philosophy.eyebrow);
      setText('philosophy-statement', philosophy.statement);
      const grid = document.getElementById('philosophy-principles');
      if (grid && Array.isArray(philosophy.principles)) {
        grid.innerHTML = philosophy.principles.map((p, i) => `
          <div class="reveal" data-delay="${i * 80}">
            <p class="font-serif text-lg mb-2">${escapeHtml(p.title)}</p>
            <p class="text-sm text-charcoal/60 leading-relaxed">${escapeHtml(p.description)}</p>
          </div>`).join('');
      }
    }

    /* Villas grid (the hub's core feature) */
    if (villasSection) {
      setText('villas-eyebrow', villasSection.eyebrow);
      setText('villas-title', villasSection.title);
      setText('villas-intro', villasSection.intro);
    }
    const villasGrid = document.getElementById('villas-grid');
    if (villasGrid && Array.isArray(villas)) {
      villasGrid.innerHTML = villas.map((v, i) => `
        <article class="reveal" data-delay="${(i % 2) * 100}">
          <a href="${escapeAttr(v.link || '#')}" class="img-zoom-wrap aspect-[4/3] block mb-5">
            <img src="${escapeAttr(v.image)}" alt="${escapeAttr(v.alt || v.name)}" class="w-full h-full object-cover" loading="lazy" width="900" height="675">
          </a>
          <a href="${escapeAttr(v.link || '#')}" class="font-serif font-semibold text-2xl mb-2 inline-block hover:text-charcoal/70 transition-colors">${escapeHtml(v.name)}</a>
          <p class="text-sm text-charcoal/55 mb-3">${v.guests} Guests &nbsp;|&nbsp; ${v.beds} Beds &nbsp;|&nbsp; ${v.baths} Baths</p>
          <p class="text-sm text-charcoal/65 leading-relaxed max-w-sm mb-3">${escapeHtml(v.description)}</p>
          <a href="${escapeAttr(v.link || '#')}" class="text-sm font-medium underline underline-offset-4 hover:text-charcoal/60">Discover More</a>
        </article>`).join('');
    }

    /* Gallery grid */
    if (gallerySection) {
      setText('gallery-eyebrow', gallerySection.eyebrow);
      setText('gallery-title', gallerySection.title);
    }
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid && Array.isArray(gallery)) {
      galleryGrid.innerHTML = gallery.map((g, i) => `
        <img data-gallery-item data-full="${escapeAttr(g.src)}" src="${escapeAttr(g.src)}" alt="${escapeAttr(g.alt)}" class="reveal w-full h-56 md:h-64 object-cover cursor-pointer" loading="lazy" data-delay="${(i % 3) * 80}" width="700" height="256">`).join('');
      window.dispatchEvent(new Event('hening:gallery-rebuilt'));
    }

    /* The Hening Standard */
    if (standard) {
      setText('standard-title', standard.title);
      setText('standard-intro', standard.intro);
      if (Array.isArray(standard.items)) {
        standard.items.forEach((item, i) => {
          setText(`standard-${i}-title`, item.title);
          setText(`standard-${i}-desc`, item.description);
        });
      }
    }

    /* Testimonials */
    if (Array.isArray(testimonials)) {
      testimonials.forEach((t, i) => {
        setText(`testimonial-${i}-quote`, `"${t.quote}"`);
        setText(`testimonial-${i}-name`, t.name);
        setText(`testimonial-${i}-location`, t.location);
      });
    }

    /* Location */
    if (location) {
      setText('location-title', location.title);
      setText('location-eyebrow', location.eyebrow);
      setText('location-p1', location.paragraph1);
      setText('location-p2', location.paragraph2);
      const locImg = document.getElementById('location-img');
      if (locImg && location.image) locImg.src = location.image;
    }

    /* Contact + newsletter */
    if (contact) {
      setText('contact-title', contact.title);
      setText('contact-intro', contact.intro);
    }
    if (newsletter) {
      setText('newsletter-title', newsletter.title);
      setText('newsletter-intro', newsletter.intro);
    }

    /* Re-observe newly created .reveal elements + rebind lightbox/gallery clicks,
       since main.js already ran by the time this content is injected. */
    window.dispatchEvent(new Event('hening:content-applied'));
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escapeAttr(str) { return escapeHtml(str); }
})();
