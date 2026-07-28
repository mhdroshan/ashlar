/**
 * ASHLAR ARCHITECTURAL GLASS SYSTEMS - INTERACTIVE CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
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
});

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

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize Lenis with GSAP ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
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
  const navLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    toggleBtn.classList.toggle('active');
    const isExpanded = drawer.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    });
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
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
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

  if (!thumbs.length || !mainImg) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const newSrc = thumb.getAttribute('data-fullsrc') || thumb.querySelector('img')?.src;
      if (newSrc) {
        mainImg.style.opacity = '0.3';
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
          
          // Also update data-img on expand floating button
          const expandBtn = document.querySelector('.gallery-expand-floating, .trigger-lightbox');
          if (expandBtn) expandBtn.setAttribute('data-img', newSrc);
        }, 200);
      }
    });
  });
}

function initLightboxModal() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const triggerBtns = document.querySelectorAll('.trigger-lightbox, .gallery-expand-floating');
  const closeBtn = document.querySelector('#lightbox-modal .modal-close');

  if (!modal || !modalImg) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-img') || document.querySelector('#main-gallery-img, .product-main-img')?.src || 'aseets/glass-frame-2.jpg';
      modalImg.src = src;
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
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
    zurich: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d86475.29130713783!2d8.4651347!3d47.3774337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47900b9749bea219%3A0x73d9830e208b03d3!2sZurich%2C%20Switzerland!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s",
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

