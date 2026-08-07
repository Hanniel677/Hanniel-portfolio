/* ============================================
   HANNIEL'S PORTFOLIO — INTERACTIONS & ANIMATIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // CURSOR GLOW — follows mouse
  // ==========================================
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
  });

  function animateCursorGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursorGlow);
  }
  animateCursorGlow();


  // ==========================================
  // NAVIGATION — scroll effect
  // ==========================================
  const nav = document.getElementById('nav');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });


  // ==========================================
  // MOBILE MENU
  // ==========================================
  window.toggleMenu = function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  };

  window.closeMenu = function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  };


  // ==========================================
  // SCROLL REVEAL — Intersection Observer
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));


  // ==========================================
  // STAT COUNTER ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((el) => counterObserver.observe(el));

  function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    function step() {
      current += increment;
      if (current >= target) {
        element.textContent = target + '+';
        return;
      }
      element.textContent = Math.floor(current) + '+';
      requestAnimationFrame(step);
    }
    step();
  }


  // ==========================================
  // MAGNETIC BUTTON EFFECT
  // ==========================================
  const magneticButtons = document.querySelectorAll('.magnetic');

  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });


  // ==========================================
  // SMOOTH SCROLL for anchor links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  // ==========================================
  // BACK TO TOP
  // ==========================================
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ==========================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksAll.forEach((link) => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = '#f5f5f5';
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach((section) => sectionObserver.observe(section));


  // ==========================================
  // TILT EFFECT on project cards
  // ==========================================
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
    });
  });


  // ==========================================
  // TEXT SPLIT ANIMATION — hero title letters
  // ==========================================
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const lines = heroTitle.querySelectorAll('.line');
    lines.forEach((line) => {
      const text = line.textContent;
      const isOutline = line.classList.contains('outline');
      line.textContent = '';
      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(40px)';
        span.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${0.4 + i * 0.03}s`;
        if (isOutline) {
          span.style.WebkitTextStroke = '1.5px #666';
          span.style.color = 'transparent';
        }
        line.appendChild(span);
      });

      // Trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          line.querySelectorAll('span').forEach((s) => {
            s.style.opacity = '1';
            s.style.transform = 'translateY(0)';
          });
        });
      });
    });
  }

});
