/**
 * ==============================================================================
 * NexusFlow — Modern Team Orchestration Platform
 * Interactive JavaScript (Week 3 Internship Implementation)
 * Features:
 *   1. Accessible Mobile Hamburger Navigation (Open / Close / Focus Trap / ESC)
 *   2. Smooth Anchor Navigation with Sticky Header Offset
 *   3. Intersection Observer Scroll-Reveal Animations for Sections and Cards
 *   4. Interactive Call-To-Action (CTA) Modal Dialog with Form Validation
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Accessible Mobile Navigation Menu
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const primaryNav = document.getElementById('primary-nav');

  /**
   * Toggles the mobile navigation drawer.
   * Updates accessibility attributes (aria-expanded) and toggles active classes.
   */
  function toggleMobileMenu() {
    if (!mobileMenuBtn || !primaryNav) return;
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    const nextState = !isExpanded;

    mobileMenuBtn.setAttribute('aria-expanded', String(nextState));
    mobileMenuBtn.classList.toggle('is-active', nextState);
    primaryNav.classList.toggle('nav-open', nextState);
  }

  /**
   * Closes the mobile navigation drawer and resets aria-expanded.
   */
  function closeMobileMenu() {
    if (!mobileMenuBtn || !primaryNav) return;
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.classList.remove('is-active');
    primaryNav.classList.remove('nav-open');
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile drawer when clicking any navigation link or action button
  if (primaryNav) {
    const navItems = primaryNav.querySelectorAll('.nav-link, .btn-mobile');
    navItems.forEach((item) => {
      item.addEventListener('click', closeMobileMenu);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Smooth Scrolling for Internal Navigation Links
  // --------------------------------------------------------------------------
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();

        // Calculate sticky header offset dynamically
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 72;
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Close mobile drawer if open
        closeMobileMenu();

        // Update URL hash without abrupt scroll jump
        if (history.pushState) {
          history.pushState(null, '', targetId);
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. Scroll-Reveal Animation for Sections and Cards
  // --------------------------------------------------------------------------
  // Elements that will animate smoothly when scrolled into view
  const revealTargets = document.querySelectorAll(
    '.feature-card, .testimonial-card, .metric-card, .partner-item, .section-header'
  );

  if ('IntersectionObserver' in window) {
    // Add base reveal class via JS (ensures graceful degradation if JS is disabled)
    revealTargets.forEach((el) => el.classList.add('reveal-element'));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target); // Reveal only once for performance
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  // --------------------------------------------------------------------------
  // 4. Interactive Call-To-Action (CTA) Modal Dialog
  // --------------------------------------------------------------------------
  const ctaModal = document.getElementById('cta-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const trialForm = document.getElementById('trial-form');
  const modalFeedback = document.getElementById('modal-feedback');
  const emailInput = document.getElementById('work-email');

  let lastFocusedElement = null;

  /**
   * Opens the interactive CTA trial modal.
   * Saves focus context and sets initial focus on the email input.
   * @param {HTMLElement} triggerElement The button that triggered the modal
   */
  function openCtaModal(triggerElement) {
    if (!ctaModal) return;
    lastFocusedElement = triggerElement || document.activeElement;

    // Reset any previous feedback
    if (modalFeedback) {
      modalFeedback.hidden = true;
      modalFeedback.textContent = '';
      modalFeedback.className = 'modal-feedback';
    }

    if (trialForm) {
      trialForm.reset();
      trialForm.hidden = false;
    }

    ctaModal.hidden = false;
    document.body.classList.add('modal-open');

    // Focus input on next animation frame
    requestAnimationFrame(() => {
      if (emailInput) {
        emailInput.focus();
      } else if (modalCloseBtn) {
        modalCloseBtn.focus();
      }
    });

    closeMobileMenu();
  }

  /**
   * Closes the interactive CTA trial modal.
   * Restores focus to the element that triggered it.
   */
  function closeCtaModal() {
    if (!ctaModal || ctaModal.hidden) return;
    ctaModal.hidden = true;
    document.body.classList.remove('modal-open');

    // Return keyboard focus to the triggering element
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  // Attach modal trigger to buttons requesting free trial
  const modalTriggers = document.querySelectorAll(
    'a[href="#cta"], a[href="#login"], .btn-primary-contrast, .btn-ghost-contrast'
  );

  modalTriggers.forEach((button) => {
    button.addEventListener('click', (event) => {
      // If it's a "Schedule a Demo" button, display custom dialog context
      const buttonText = button.textContent.trim().toLowerCase();
      if (buttonText.includes('demo') || buttonText.includes('trial') || buttonText.includes('started') || buttonText.includes('sign in')) {
        event.preventDefault();
        openCtaModal(button);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCtaModal);
  }

  // Close modal when clicking on the dark backdrop overlay
  if (ctaModal) {
    ctaModal.addEventListener('click', (event) => {
      if (event.target === ctaModal) {
        closeCtaModal();
      }
    });
  }

  // Handle Form Submission inside the Modal
  if (trialForm) {
    trialForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const userEmail = emailInput ? emailInput.value.trim() : '';
      if (!userEmail) return;

      // Display positive feedback without navigating away
      trialForm.hidden = true;
      if (modalFeedback) {
        modalFeedback.hidden = false;
        modalFeedback.className = 'modal-feedback is-success';
        modalFeedback.innerHTML = `
          <strong>&#10003; Workspace Initialized!</strong>
          <p>We've sent a 14-day setup link to <em>${escapeHtml(userEmail)}</em>. Check your inbox to begin!</p>
        `;
      }

      // Automatically close modal after 3.5 seconds
      setTimeout(() => {
        closeCtaModal();
      }, 3500);
    });
  }

  // --------------------------------------------------------------------------
  // 5. Global Keyboard Accessibility (Escape Key Handler & Focus Trap)
  // --------------------------------------------------------------------------
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      // Prioritize closing the modal if open
      if (ctaModal && !ctaModal.hidden) {
        closeCtaModal();
        return;
      }
      // Otherwise close mobile drawer if open
      if (primaryNav && primaryNav.classList.contains('nav-open')) {
        closeMobileMenu();
        if (mobileMenuBtn) mobileMenuBtn.focus();
      }
    }

    // Modal Focus Trap
    if (ctaModal && !ctaModal.hidden && event.key === 'Tab') {
      const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = ctaModal.querySelectorAll(focusableSelectors);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });

  /**
   * Helper function to escape HTML special characters for safe output.
   * @param {string} str Untrusted user input
   * @returns {string} Sanitized string
   */
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return map[m] || m;
    });
  }
});
