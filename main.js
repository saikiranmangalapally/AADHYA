/* ============================================
   AADHYA'S LIFE LINE — Core Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- Mobile menu toggle ----
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
    document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('mobile-open');
      document.body.style.overflow = '';
    });
  });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const activeLink = navLinks.querySelector(`a[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Scroll reveal animations ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger delay for grid children
        const parent = entry.target.parentElement;
        if (parent) {
          const siblings = Array.from(parent.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Counter animation ----
  const trustNumbers = document.querySelectorAll('.trust-number[data-count]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    trustNumbers.forEach(num => {
      const target = parseInt(num.dataset.count);
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const step = () => {
        current += increment;
        if (current >= target) {
          num.textContent = target >= 1000 ? `${(target / 1000).toFixed(0)}K+` : `${target}+`;
          return;
        }
        num.textContent = Math.floor(current);
        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroTrust = document.querySelector('.hero-trust');
  if (heroTrust) counterObserver.observe(heroTrust);

  // ---- Testimonial carousel ----
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;

    const getCardWidth = () => {
      if (!cards[0]) return 0;
      const style = getComputedStyle(track);
      const gap = parseInt(style.gap) || 24;
      return cards[0].offsetWidth + gap;
    };

    const getVisibleCards = () => {
      const containerWidth = track.parentElement.offsetWidth;
      const cardWidth = getCardWidth();
      return Math.floor(containerWidth / cardWidth) || 1;
    };

    const scrollToIndex = (index) => {
      const maxIndex = Math.max(0, totalCards - getVisibleCards());
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      const offset = currentIndex * getCardWidth();
      track.style.transform = `translateX(-${offset}px)`;
    };

    prevBtn.addEventListener('click', () => scrollToIndex(currentIndex - 1));
    nextBtn.addEventListener('click', () => scrollToIndex(currentIndex + 1));

    // Auto-rotate
    let autoRotate = setInterval(() => {
      const maxIndex = Math.max(0, totalCards - getVisibleCards());
      scrollToIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    }, 5000);

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoRotate));
    track.addEventListener('mouseleave', () => {
      autoRotate = setInterval(() => {
        const maxIndex = Math.max(0, totalCards - getVisibleCards());
        scrollToIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
      }, 5000);
    });

    // Recalculate on resize
    window.addEventListener('resize', () => scrollToIndex(currentIndex));
  }

  // ---- Appointment form ----
  const form = document.getElementById('appointmentForm');
  const formSuccess = document.getElementById('formSuccess');
  const dateInput = document.getElementById('patientDate');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name = document.getElementById('patientName').value.trim();
      const phone = document.getElementById('patientPhone').value.trim();
      const service = document.getElementById('patientService').value;
      const date = document.getElementById('patientDate').value;

      if (!name || !phone || !service || !date) {
        return;
      }

      // Phone validation (Indian format)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }

      // Show success state
      form.style.display = 'none';
      formSuccess.classList.add('show');

      // Prepare WhatsApp message as backup
      const message = `Hi, I'd like to book an appointment.\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date}`;
      console.log('Appointment booked:', { name, phone, service, date });

      // Reset after 8 seconds
      setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        formSuccess.classList.remove('show');
      }, 8000);
    });
  }

  // ---- Parallax-lite for hero ----
  const hero = document.querySelector('.hero');
  if (hero && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        const heroImg = document.querySelector('.hero-image-wrapper');
        if (heroImg) {
          heroImg.style.transform = `translateY(${scrolled * 0.08}px)`;
        }
      }
    }, { passive: true });
  }

  // ---- Symptom Checker ----
  const chips = document.querySelectorAll('.symptom-chip');
  const resultContainer = document.getElementById('symptomResult');
  const resultTitle = document.getElementById('resultTitle');
  const resultDesc = document.getElementById('resultDesc');
  const selService = document.getElementById('patientService');

  const recommendations = {
    fatigue: {
      title: "Recommended: Vitamin B12 & D3 Test",
      desc: "Fatigue is the #1 sign of vitamin deficiency. Checking these levels safely rules out common causes.",
      dropdownVal: "b12"
    },
    hairloss: {
      title: "Recommended: Thyroid Profile & Iron Studies",
      desc: "Hair loss often hooks back to unnoticed thyroid imbalances or severe iron deficiency.",
      dropdownVal: "full-body-checkup"
    },
    weight: {
      title: "Recommended: Full Body & Metabolic Panel",
      desc: "Sudden weight gain can be linked to slowed metabolism, thyroid issues, or underlying lifestyle diseases.",
      dropdownVal: "full-body-checkup"
    },
    periods: {
      title: "Recommended: PCOS & Gynecologist Consultation",
      desc: "Irregularities are standard markers for hormonal imbalances like PCOS. A quick ultrasound and consult provides total clarity.",
      dropdownVal: "pcos"
    }
  };

  if (chips.length && resultContainer) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const code = chip.getAttribute('data-symptom');
        const data = recommendations[code];

        if (data) {
          resultTitle.textContent = data.title;
          resultDesc.textContent = data.desc;
          
          if (selService) {
            selService.value = data.dropdownVal;
          }

          resultContainer.classList.remove('show');
          void resultContainer.offsetWidth; 
          resultContainer.classList.add('show');
        }
      });
    });
  }

  // ---- Body Insight Links ----
  const bodyInsightLinks = document.querySelectorAll('.body-insights-grid .card-link');
  bodyInsightLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.dataset.target;
      if (selService && target) {
        selService.value = target;
      }
    });
  });

});
