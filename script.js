/* ============================================
   HANNIEL'S PORTFOLIO — INTERACTIONS & ANIMATIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // CLICK SPARK EFFECT (Vanilla Canvas Engine)
  // ==========================================
  const sparkCanvas = document.getElementById('click-spark-canvas');
  if (sparkCanvas) {
    const ctx = sparkCanvas.getContext('2d');
    let sparks = [];
    const sparkColor = '#ffffff';
    const sparkSize = 10;
    const sparkRadius = 18;
    const sparkCount = 8;
    const duration = 400;

    const resizeCanvas = () => {
      sparkCanvas.width = window.innerWidth;
      sparkCanvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const easeOut = t => t * (2 - t);

    const animateSparks = timestamp => {
      ctx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);

      sparks = sparks.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = easeOut(progress);

        const distance = eased * sparkRadius;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      requestAnimationFrame(animateSparks);
    };
    requestAnimationFrame(animateSparks);

    window.addEventListener('click', e => {
      const now = performance.now();
      const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
        x: e.clientX,
        y: e.clientY,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now
      }));
      sparks.push(...newSparks);
    });
  }

  // ==========================================
  // SHORT FLUID METABALL BLOB CURSOR (Canvas + SVG Goo Filter)
  // ==========================================
  const fluidCanvas = document.getElementById('fluid-cursor-canvas');
  if (fluidCanvas && window.innerWidth > 768) {
    const fctx = fluidCanvas.getContext('2d');

    const resizeFluidCanvas = () => {
      fluidCanvas.width = window.innerWidth;
      fluidCanvas.height = window.innerHeight;
    };
    resizeFluidCanvas();
    window.addEventListener('resize', resizeFluidCanvas);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let leadX = mouseX;
    let leadY = mouseY;
    let isHovering = false;
    let isActive = false;
    let activeMagneticEl = null;

    // Small refined blob sizes: 9px base radius (18px diameter), 20px hover radius (40px diameter)
    let currentRadius = 9;
    const baseRadius = 9;
    const hoverRadius = 20;

    // Short history (9 points) for a compact liquid trail
    const history = [];
    const MAX_HISTORY = 9;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('mousedown', () => {
      isActive = true;
    });

    window.addEventListener('mouseup', () => {
      isActive = false;
    });

    // Detect interactive magnetic targets
    const magneticTargets = document.querySelectorAll(
      'a, button, .btn-primary, .btn-secondary, .skill-card, .project-card, .social-link, .contact-email, .nav-logo, [data-magnetic]'
    );

    magneticTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        activeMagneticEl = target;
        isHovering = true;
      });

      target.addEventListener('mouseleave', () => {
        if (activeMagneticEl === target) {
          activeMagneticEl = null;
          isHovering = false;
          target.style.transform = '';
        }
      });
    });

    const renderFluidBlob = () => {
      fctx.clearRect(0, 0, fluidCanvas.width, fluidCanvas.height);

      let targetX = mouseX;
      let targetY = mouseY;

      if (activeMagneticEl) {
        const rect = activeMagneticEl.getBoundingClientRect();
        const centerElX = rect.left + rect.width / 2;
        const centerElY = rect.top + rect.height / 2;

        const magneticFactor = 0.55;
        targetX = mouseX + (centerElX - mouseX) * magneticFactor;
        targetY = mouseY + (centerElY - mouseY) * magneticFactor;

        const dx = mouseX - centerElX;
        const dy = mouseY - centerElY;
        activeMagneticEl.style.transform = `translate3d(${dx * 0.25}px, ${dy * 0.25}px, 0)`;
      }

      // Smooth lerp motion for lead cursor
      leadX = lerp(leadX, targetX, 0.18);
      leadY = lerp(leadY, targetY, 0.18);

      // Smooth radius transitions
      const targetRadius = isHovering ? hoverRadius : baseRadius;
      const activeMultiplier = isActive ? 0.75 : 1.0;
      currentRadius = lerp(currentRadius, targetRadius * activeMultiplier, 0.2);

      // Record short point history
      history.unshift({ x: leadX, y: leadY });
      if (history.length > MAX_HISTORY) {
        history.pop();
      }

      // Render connected metaball shapes for SVG goo filter fusion
      fctx.fillStyle = '#ffffff';
      fctx.strokeStyle = '#ffffff';
      fctx.lineCap = 'round';
      fctx.lineJoin = 'round';

      for (let i = 0; i < history.length; i++) {
        const point = history[i];
        const ratio = 1 - i / history.length;
        const radius = Math.max(3, currentRadius * Math.pow(ratio, 0.6));

        fctx.beginPath();
        fctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        fctx.fill();

        if (i < history.length - 1) {
          const next = history[i + 1];
          const nextRatio = 1 - (i + 1) / history.length;
          const nextRadius = Math.max(3, currentRadius * Math.pow(nextRatio, 0.6));

          fctx.lineWidth = (radius + nextRadius);
          fctx.beginPath();
          fctx.moveTo(point.x, point.y);
          fctx.lineTo(next.x, next.y);
          fctx.stroke();
        }
      }

      requestAnimationFrame(renderFluidBlob);
    };

    requestAnimationFrame(renderFluidBlob);
  }


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
