/* ========================================
   MAIN JAVASCRIPT - SaaS Review Portal
   ======================================== */

(function() {
  'use strict';

  // ---- Cookie Consent ----
  const CookieConsent = {
    init() {
      const banner = document.getElementById('cookie-banner');
      const consent = localStorage.getItem('cookie-consent');
      
      if (!consent && banner) {
        setTimeout(() => {
          banner.classList.add('show');
        }, 1000);
      }

      this.bindEvents();
    },

    bindEvents() {
      const acceptAll = document.getElementById('cookie-accept-all');
      const essentialOnly = document.getElementById('cookie-essential-only');
      const customize = document.getElementById('cookie-customize');

      if (acceptAll) {
        acceptAll.addEventListener('click', () => this.accept('all'));
      }
      if (essentialOnly) {
        essentialOnly.addEventListener('click', () => this.accept('essential'));
      }
      if (customize) {
        customize.addEventListener('click', () => this.showCustomize());
      }
    },

    accept(type) {
      localStorage.setItem('cookie-consent', type);
      const banner = document.getElementById('cookie-banner');
      if (banner) {
        banner.classList.remove('show');
      }
      // Initialize analytics if consented
      if (type === 'all') {
        this.initAnalytics();
      }
    },

    showCustomize() {
      // Future: Show detailed cookie preferences modal
      console.log('Cookie customization modal would open here');
    },

    initAnalytics() {
      // Future: Initialize Google Analytics or PostHog
      console.log('Analytics initialized');
    }
  };

  // ---- FAQ Accordion ----
  const FAQAccordion = {
    init() {
      const items = document.querySelectorAll('.faq-item');
      items.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
          question.addEventListener('click', () => this.toggle(item));
        }
      });
    },

    toggle(item) {
      const isActive = item.classList.contains('active');
      
      // Close all items
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    }
  };

  // ---- Mobile Menu ----
  const MobileMenu = {
    init() {
      const btn = document.getElementById('mobile-menu-btn');
      const nav = document.getElementById('main-nav');
      
      if (btn && nav) {
        btn.addEventListener('click', () => this.toggle(nav));
      }
    },

    toggle(nav) {
      nav.classList.toggle('show');
    }
  };

  // ---- Search ----
  const Search = {
    init() {
      const input = document.getElementById('search-input');
      if (input) {
        input.addEventListener('input', (e) => this.debounceSearch(e.target.value));
      }
    },

    debounceSearch(query) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.search(query);
      }, 300);
    },

    search(query) {
      if (query.length < 2) return;
      // Future: Implement actual search
      console.log('Searching for:', query);
    }
  };

  // ---- Sticky CTA ----
  const StickyCTA = {
    init() {
      const stickyCta = document.querySelector('.sticky-cta');
      if (stickyCta) {
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
          if (window.scrollY > 300) {
            stickyCta.style.display = 'block';
          } else {
            stickyCTA.style.display = 'none';
          }
        });
      }
    }
  };

  // ---- Email Form ----
  const EmailForm = {
    init() {
      const forms = document.querySelectorAll('.email-form');
      forms.forEach(form => {
        form.addEventListener('submit', (e) => this.handleSubmit(e));
      });
    },

    handleSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const email = form.querySelector('.email-input').value;
      
      if (this.validateEmail(email)) {
        // Future: Send to API
        console.log('Email submitted:', email);
        this.showSuccess(form);
      }
    },

    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    showSuccess(form) {
      form.innerHTML = '<p style="color: var(--color-success); font-weight: 500;">✓ Check your inbox for the checklist!</p>';
    }
  };

  // ---- Initialize Everything ----
  document.addEventListener('DOMContentLoaded', function() {
    CookieConsent.init();
    FAQAccordion.init();
    MobileMenu.init();
    Search.init();
    StickyCTA.init();
    EmailForm.init();
  });

})();
