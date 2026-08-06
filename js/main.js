/**
 * ASHLAR ARCHITECTURAL GLASS SYSTEMS - INTERACTIVE CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initLenisScroll();
  initHeaderScroll();
  initMobileMenu();
  initGSAPAnimations();
  initAccordion();
  initFinishConfigurator();
  initProductGallery();
  initLightboxModal();
  initContactForm();
  initRangeSliders();
  initLocationSwitcher();
  initScrollytelling();
  initLifestyleHotspots();
  initFooterUtilities();
});

/* --------------------------------------------------
   0. Preloader Controller
   -------------------------------------------------- */
function initPreloader() {
  let preloader = document.getElementById('preloader');

  if (!preloader) {
    preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.className = 'preloader';
    preloader.setAttribute('aria-label', 'Loading Ashlar System Windows');
    preloader.innerHTML = `
      <div class="preloader-backdrop"></div>
      <div class="preloader-content">
        <div class="preloader-logo-card">
          <div class="preloader-logo-wrapper">
            <img src="aseets/preloader.png" alt="Ashlar System Windows Logo" class="preloader-logo">
            <div class="glass-shine-sweep"></div>
          </div>
        </div>
        <div class="preloader-line-track">
          <div class="preloader-line-fill"></div>
        </div>
      </div>
    `;
    document.body.prepend(preloader);
  }

  document.body.classList.add('preloader-active');
  if (typeof lenis !== 'undefined' && lenis) {
    lenis.stop();
  }

  const startTime = Date.now();
  const minDisplayTime = 700; // ms minimum display to appreciate glass shine animation

  const hidePreloader = () => {
    if (!preloader || preloader.classList.contains('preloader-hidden')) return;

    preloader.classList.add('preloader-hidden');
    document.body.classList.remove('preloader-active');

    if (typeof lenis !== 'undefined' && lenis) {
      lenis.start();
    }

    setTimeout(() => {
      if (preloader && preloader.parentNode) {
        preloader.style.display = 'none';
      }
    }, 900);
  };

  const scheduleHide = () => {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
    setTimeout(hidePreloader, remainingTime);
  };

  if (document.readyState === 'complete') {
    scheduleHide();
  } else {
    window.addEventListener('load', scheduleHide);
    // Safety fallback timeout
    setTimeout(hidePreloader, 2500);
  }
}

/* --------------------------------------------------
   1. Lenis Smooth Scroll Integration
   -------------------------------------------------- */
let lenis;
function initLenisScroll() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    });

    // Synchronize Lenis with GSAP ScrollTrigger if available (do NOT run separate RAF loop)
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }
}

/* --------------------------------------------------
   2. Header Scroll Effect
   -------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------
   3. Mobile Menu Toggle
   -------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const navLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!drawer) return;

  const openMenu = () => {
    drawer.classList.add('open');
    if (toggleBtn) {
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
    if (typeof lenis !== 'undefined' && lenis) {
      lenis.stop();
    }
  };

  const closeMenu = () => {
    drawer.classList.remove('open');
    if (toggleBtn) {
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
    if (typeof lenis !== 'undefined' && lenis) {
      lenis.start();
    }
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------
   4. GSAP Scroll Animations & Stats Counter
   -------------------------------------------------- */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Entrance Timeline
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.1 } });
    tl.fromTo('.hero-badge', { opacity: 0, y: 25 }, { opacity: 1, y: 0, delay: 0.15 })
      .fromTo('.hero-title', { opacity: 0, y: 35 }, { opacity: 1, y: 0 }, '-=0.85')
      .fromTo('.hero-subtitle', { opacity: 0, y: 25 }, { opacity: 1, y: 0 }, '-=0.85')
      .fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, '-=0.85');
  }

  // Fade Up Reveal Elements
  const revealElements = document.querySelectorAll('.reveal-up');
  revealElements.forEach(el => {
    gsap.fromTo(el, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        onComplete: () => {
          gsap.set(el, { clearProps: 'transform' });
        }
      }
    );
  });

  // Fade In Reveal
  const fadeElements = document.querySelectorAll('.reveal-fade');
  fadeElements.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%'
        }
      }
    );
  });

  // Animated Numbers Counter
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  statNumbers.forEach(stat => {
    const target = parseFloat(stat.getAttribute('data-count'));
    const decimals = stat.getAttribute('data-decimals') || 0;
    const suffix = stat.getAttribute('data-suffix') || '';
    
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            stat.innerText = this.targets()[0].val.toFixed(decimals) + suffix;
          }
        });
      }
    });
  });
}

/* --------------------------------------------------
   5. Accordion System
   -------------------------------------------------- */
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all active accordions in group
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBody = otherItem.querySelector('.accordion-body');
        if (otherBody) otherBody.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------
   6. Interactive Finish Configurator
   -------------------------------------------------- */
function initFinishConfigurator() {
  const swatches = document.querySelectorAll('.swatch');
  const finishNameLabel = document.getElementById('selected-finish-name');
  const finishCodeLabel = document.getElementById('selected-finish-code');
  const previewImg = document.getElementById('finish-preview-img');

  if (!swatches.length) return;

  const finishData = {
    silver: { name: 'Soft Silver (Anodized Collection)', code: 'VTC-SLV', img: 'aseets/glass-frame-2.jpg' },
    black: { name: 'Anodic Black (Anodized Collection)', code: 'VTC-BLK', img: 'aseets/glass-frame-1.jpg' },
    bronze: { name: 'Anodic Bronze (Anodized Collection)', code: 'VTC-BRZ', img: 'aseets/glass-frame-3.jpg' },
    champagne: { name: 'Soft Champagne (Anodized Collection)', code: 'VTC-CHM', img: 'aseets/glass-frame-4.jpg' },
    white: { name: 'Hipco White (Powder Coated)', code: 'VTC-WHT', img: 'aseets/glass-frame-5.jpg' }
  };

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => {
        s.classList.remove('active');
        s.style.borderColor = 'transparent';
      });
      swatch.classList.add('active');
      swatch.style.borderColor = 'var(--text-primary)';

      const finishKey = swatch.getAttribute('data-finish');
      const data = finishData[finishKey];

      if (data) {
        if (finishNameLabel) finishNameLabel.textContent = data.name;
        if (finishCodeLabel) finishCodeLabel.textContent = data.code;
        if (previewImg) {
          previewImg.style.opacity = '0.4';
          setTimeout(() => {
            previewImg.src = data.img;
            previewImg.style.opacity = '1';
          }, 200);
        }
      }
    });
  });
}

/* --------------------------------------------------
   7. Product Image Gallery & Lightbox
   -------------------------------------------------- */
function initProductGallery() {
  const thumbs = document.querySelectorAll('.gallery-thumb-card, .thumb-item');
  const mainImg = document.querySelector('#main-gallery-img, .product-main-img');
  const mainContainer = document.querySelector('.gallery-main-container');
  const thumbCols = document.querySelectorAll('.gallery-thumb-col');

  // Prevent Lenis smooth scroll from hijacking wheel events inside the thumbnail column
  thumbCols.forEach(col => {
    col.setAttribute('data-lenis-prevent', 'true');
    col.addEventListener('wheel', (e) => {
      e.stopPropagation();
    }, { passive: true });
  });

  if (!thumbs.length || !mainImg) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

      const newSrc = thumb.getAttribute('data-fullsrc') || thumb.querySelector('img')?.src;
      if (newSrc) {
        mainImg.style.opacity = '0.4';
        mainImg.style.transform = 'scale(0.98)';
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
          mainImg.style.transform = 'scale(1)';
          
          // Sync data-img attributes
          const expandBtn = document.querySelector('.gallery-expand-floating');
          if (expandBtn) expandBtn.setAttribute('data-img', newSrc);
          mainImg.setAttribute('data-img', newSrc);
        }, 180);
      }
    });
  });

  // Clicking main gallery image directly opens lightbox modal
  if (mainContainer) {
    mainContainer.addEventListener('click', (e) => {
      if (e.target.closest('.gallery-expand-floating')) return;
      const currentSrc = mainImg.getAttribute('data-img') || mainImg.src;
      const modal = document.getElementById('lightbox-modal');
      const modalImg = document.getElementById('lightbox-img');
      const captionEl = document.querySelector('#lightbox-modal .lightbox-caption');
      if (modal && modalImg) {
        modalImg.src = currentSrc;
        const activeThumb = document.querySelector('.gallery-thumb-card.active');
        if (captionEl) {
          captionEl.textContent = activeThumb ? (activeThumb.getAttribute('title') || activeThumb.querySelector('img')?.alt || '') : '';
        }
        modal.classList.add('active');
      }
    });
  }
}

function initLightboxModal() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const triggerBtns = document.querySelectorAll('.trigger-lightbox, .gallery-expand-floating');
  const closeBtn = document.querySelector('#lightbox-modal .modal-close');
  const prevBtn = document.querySelector('#lightbox-modal .lightbox-prev');
  const nextBtn = document.querySelector('#lightbox-modal .lightbox-next');
  const captionEl = document.querySelector('#lightbox-modal .lightbox-caption');

  if (!modal || !modalImg) return;

  let currentIdx = 0;

  const getImages = () => {
    const thumbs = document.querySelectorAll('.gallery-thumb-card');
    if (!thumbs.length) return [];
    return Array.from(thumbs).map(t => ({
      src: t.getAttribute('data-fullsrc') || t.querySelector('img')?.src,
      title: t.getAttribute('title') || t.querySelector('img')?.alt || ''
    }));
  };

  const updateLightbox = (idx) => {
    const images = getImages();
    if (!images.length) return;
    if (idx < 0) idx = images.length - 1;
    if (idx >= images.length) idx = 0;
    currentIdx = idx;

    modalImg.style.opacity = '0.3';
    setTimeout(() => {
      modalImg.src = images[currentIdx].src;
      modalImg.style.opacity = '1';
      if (captionEl) captionEl.textContent = images[currentIdx].title;
    }, 150);

    // Sync active thumb state & main image
    const thumbs = document.querySelectorAll('.gallery-thumb-card');
    thumbs.forEach((t, i) => t.classList.toggle('active', i === currentIdx));
    const mainImg = document.querySelector('#main-gallery-img');
    if (mainImg) mainImg.src = images[currentIdx].src;
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const images = getImages();
      const src = btn.getAttribute('data-img') || btn.getAttribute('data-fullsrc') || (document.querySelector('#main-gallery-img')?.src);
      
      const foundIdx = images.findIndex(img => img.src === src);
      currentIdx = foundIdx !== -1 ? foundIdx : 0;

      modalImg.src = src || (images[0]?.src || '');
      if (captionEl && images[currentIdx]) {
        captionEl.textContent = images[currentIdx].title;
      }
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightbox(currentIdx - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightbox(currentIdx + 1);
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-img-container')) {
      modal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') modal.classList.remove('active');
    if (e.key === 'ArrowLeft') updateLightbox(currentIdx - 1);
    if (e.key === 'ArrowRight') updateLightbox(currentIdx + 1);
  });
}

/* --------------------------------------------------
   8. Contact Form & Spec Request Handler
   -------------------------------------------------- */
function initContactForm() {
  const forms = document.querySelectorAll('.js-contact-form, .js-quote-form');
  if (!forms.length) return;

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      openQuoteModal();
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #4cd964;"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* --------------------------------------------------
   9. Range Input Value Display
   -------------------------------------------------- */
function initRangeSliders() {
  const sliders = document.querySelectorAll('.range-slider');

  sliders.forEach(slider => {
    const valDisplay = document.getElementById(slider.getAttribute('data-target'));
    if (valDisplay) {
      slider.addEventListener('input', () => {
        valDisplay.textContent = slider.value + ' ' + (slider.getAttribute('data-unit') || '');
      });
    }
  });
}

/* --------------------------------------------------
   10. Location Switcher (Contact Page)
   -------------------------------------------------- */
function initLocationSwitcher() {
  const locationTabs = document.querySelectorAll('.location-tab');
  const mapIframe = document.getElementById('showroom-map');

  if (!locationTabs.length || !mapIframe) return;

  const maps = {
    calicut: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125218.42823616656!2d75.73600649726563!3d11.2587531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65938563d4747%3A0x32150641ca32ec13!2sKozhikode%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    zurich: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125218.42823616656!2d75.73600649726563!3d11.2587531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65938563d4747%3A0x32150641ca32ec13!2sKozhikode%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    dubai: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14439.117260599587!2d55.2721877!3d25.197197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sDubai%20Design%20District!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s",
    newyork: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.217707161047!2d-73.9865749!3d40.7554868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25901a412760d%3A0x28e0e7a1772e293a!2s5th%20Ave%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s",
    tokyo: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12964.7170881958!2d139.7225102!3d35.6644781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b820a40d517%3A0xc34a66a1f11c750!2sRoppongi%20Hills!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
  };

  locationTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      locationTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const locKey = tab.getAttribute('data-location');
      if (maps[locKey]) {
        mapIframe.src = maps[locKey];
      }
    });
  });
}

// Global WhatsApp quote trigger utility
function openQuoteModal(customMessage) {
  const phone = '919895652725';
  const defaultMsg = 'Hello Ashlar, I would like to request a quote and architectural specifications for your glass systems.';
  const msg = encodeURIComponent(customMessage || defaultMsg);
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
}

// Official System Brochure download trigger
function downloadBrochure() {
  const fileUrl = 'https://ashlar.com/aseets/ashlar-system-windows-section.png';
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = 'Ashlar-Architectural-Glass-System-Brochure.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    openQuoteModal('Hello Ashlar, I have downloaded the System Brochure and would like to request full CAD sections and Revit BIM models for my project.');
  }, 500);
}

function closeQuoteModal() {
  // Utility fallback
}

/* --------------------------------------------------
   11. Scrollytelling Scroll Storytelling Controller
   -------------------------------------------------- */
function initScrollytelling() {
  const steps = document.querySelectorAll('.story-step');
  const layers = document.querySelectorAll('.scrolly-layer');
  const badge = document.querySelector('.scrolly-media-badge');

  if (!steps.length || !layers.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -30% 0px',
    threshold: 0.25
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        steps.forEach(s => s.classList.remove('active'));
        entry.target.classList.add('active');

        const stepIndex = entry.target.getAttribute('data-step');
        
        layers.forEach(layer => {
          layer.classList.remove('active');
          if (layer.getAttribute('data-layer') === stepIndex) {
            layer.classList.add('active');
          }
        });

        if (badge) {
          const badgeText = entry.target.getAttribute('data-badge');
          if (badgeText) badge.textContent = badgeText;
        }
      }
    });
  }, observerOptions);

  steps.forEach(step => observer.observe(step));
}


/* --------------------------------------------------
   12. Full-Width Lifestyle Hotspot Controller
   -------------------------------------------------- */
function initLifestyleHotspots() {
  const hotspots = document.querySelectorAll('.lifestyle-hotspot');

  hotspots.forEach(spot => {
    spot.addEventListener('click', (e) => {
      e.stopPropagation();
      hotspots.forEach(s => {
        if (s !== spot) s.classList.remove('active');
      });
      spot.classList.toggle('active');
    });
  });

  document.addEventListener('click', () => {
    hotspots.forEach(s => s.classList.remove('active'));
  });
}

/* --------------------------------------------------
   13. Footer Utilities (Back to Top & Newsletter)
   -------------------------------------------------- */
function initFooterUtilities() {
  // Back to top scroll
  const backToTopBtns = document.querySelectorAll('.footer-back-to-top, .footer-back-to-top-minimal');
  backToTopBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof lenis !== 'undefined' && lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Newsletter Subscription Form
  const newsletterForms = document.querySelectorAll('.footer-newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.footer-newsletter-input');
      const btn = form.querySelector('.footer-newsletter-btn');
      
      if (input && input.value.trim() !== '') {
        const originalText = btn.innerHTML;
        btn.innerHTML = `✓ Subscribed`;
        btn.style.background = '#22c55e';
        btn.style.color = '#ffffff';
        input.value = '';
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 3500);
      }
    });
  });
}

// Recalculate ScrollTrigger positions after all page assets load
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});
