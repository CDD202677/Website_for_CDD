/**
 * CDD Consult Private Limited - Core Site Scripts
 * Optimized Production Build
 */
document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================
     1. RESPONSIVE MOBILE MENU NAVIGATION
     ========================================== */
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const navWrapper = document.querySelector(".nav-menu-wrapper");
  const navItems = document.querySelectorAll(".nav-item");

  if (menuToggle && navWrapper) {
    // Toggle active classes on click
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("open");
      navWrapper.classList.toggle("mobile-open");
    });

    // Close menu smoothly when clicking links
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        menuToggle.classList.remove("open");
        navWrapper.classList.remove("mobile-open");
        
        // Dynamic link highlight assignment
        navItems.forEach(link => link.classList.remove("active"));
        item.classList.add("active");
      });
    });
  }


  /* ==========================================
     2. INFINITE HERO HEADLINE TYPEWRITER LOOP
     ========================================== */
  const words = ["Solutions", "Services", "Engineering Layouts"];
  const textContainer = document.querySelector(".animated-text");
  let typewriterTimerId = null;
  
  if (textContainer) {
    let wordIndex = 0;
    let characterCursor = 0;
    let isDeleting = false;
    
    const TYPE_SPEED = 80;      
    const DELETE_SPEED = 40;    
    const HOLD_DURATION = 3500; 

    function runTypeCycle() {
      const currentWord = words[wordIndex];
      textContainer.textContent = currentWord.slice(0, characterCursor);

      if (!isDeleting) {
        characterCursor++;
        
        if (characterCursor > currentWord.length) {
          isDeleting = true;
          typewriterTimerId = setTimeout(runTypeCycle, HOLD_DURATION);
          return;
        }
      } else {
        characterCursor--;
        
        if (characterCursor < 0) {
          isDeleting = false;
          characterCursor = 0;
          wordIndex = (wordIndex + 1) % words.length; 
          typewriterTimerId = setTimeout(runTypeCycle, 400); 
          return;
        }
      }

      const dynamicDelay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
      typewriterTimerId = setTimeout(runTypeCycle, dynamicDelay);
    }

    typewriterTimerId = setTimeout(runTypeCycle, 400);
  }


  /* ==========================================
     3. SEAMLESS CIRCULAR CAROUSEL SLIDER
     ========================================== */
  const track = document.querySelector(".slider-track");
  const originalCards = document.querySelectorAll(".slide-card");
  const dots = document.querySelectorAll(".dot");
  const sliderSection = document.querySelector(".slider-section");
  
  if (track && originalCards.length > 0 && dots.length > 0) {
    const slideInterval = 3000; 
    const gap = 30; 
    const numOriginals = originalCards.length;

    // Clone elements for continuous wrapping paths
    for (let i = 0; i < 3; i++) {
      const clone = originalCards[i].cloneNode(true);
      clone.classList.add("is-clone");
      track.appendChild(clone);
    }

    const lastClone = originalCards[numOriginals - 1].cloneNode(true);
    lastClone.classList.add("is-clone");
    track.insertBefore(lastClone, originalCards[0]);

    const allCards = document.querySelectorAll(".slide-card");
    let currentIndex = 1; 
    let autoPlayTimer = null;
    let isTransitioning = false;

    function getCardWidth() {
      return originalCards[0].getBoundingClientRect().width;
    }

    function initSliderPosition() {
      track.style.transition = "none";
      track.style.transform = `translateX(-${currentIndex * (getCardWidth() + gap)}px)`;
      updateActiveStates();
    }

    function updateActiveStates() {
      let dotIndex = (currentIndex - 1) % numOriginals;
      if (currentIndex === 0) dotIndex = numOriginals - 1;

      dots.forEach((dot, i) => {
        dot.classList.toggle("active-dot", i === dotIndex);
      });

      allCards.forEach((card, i) => {
        let itemIndex = (i - 1) % numOriginals;
        if (i === 0) itemIndex = numOriginals - 1;
        card.classList.toggle("active-card", itemIndex === dotIndex);
      });
    }

    function moveSlider(index) {
      if (isTransitioning) return;
      isTransitioning = true;
      
      currentIndex = index;
      track.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
      track.style.transform = `translateX(-${currentIndex * (getCardWidth() + gap)}px)`;
      
      updateActiveStates();
    }

    track.addEventListener("transitionend", () => {
      isTransitioning = false;

      if (currentIndex >= numOriginals + 1) {
        track.style.transition = "none";
        currentIndex = 1;
        track.style.transform = `translateX(-${currentIndex * (getCardWidth() + gap)}px)`;
      }
      
      if (currentIndex === 0) {
        track.style.transition = "none";
        currentIndex = numOriginals;
        track.style.transform = `translateX(-${currentIndex * (getCardWidth() + gap)}px)`;
      }
    });

    function startAutoPlay() {
      if (!autoPlayTimer) {
        autoPlayTimer = setInterval(() => {
          moveSlider(currentIndex + 1);
        }, slideInterval);
      }
    }

    function stopAutoPlay() {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        if (isTransitioning) return;
        stopAutoPlay();
        moveSlider(i + 1);
        startAutoPlay();
      });
    });

    if (sliderSection) {
      sliderSection.addEventListener("mouseenter", stopAutoPlay);
      sliderSection.addEventListener("mouseleave", startAutoPlay);
    }

    // Touch Support Configuration for Mobile Viewports
    let startX = 0;
    track.addEventListener("touchstart", (e) => {
      stopAutoPlay();
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50 && !isTransitioning) { 
        if (diff > 0) {
          moveSlider(currentIndex + 1);
        } else {
          moveSlider(currentIndex - 1);
        }
      }
      startAutoPlay();
    }, { passive: true });

    window.addEventListener("resize", initSliderPosition);
    
    // Launch Slider Engine Bounds
    initSliderPosition();
    startAutoPlay();
  }


  /* ==========================================
     4. INTERSECTION OBSERVER ANIMATING COUNTERS
     ========================================== */
  const counters = document.querySelectorAll(".stat-number");
  const counterDuration = 2000; 

  if (counters.length > 0) {
    const startCounter = (counter) => {
      const target = +counter.getAttribute("data-target");
      const suffix = counter.getAttribute("data-suffix") || "";
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / counterDuration, 1);
        const currentValue = Math.floor(progress * target);

        if (suffix === "K" && currentValue >= 1000) {
          counter.innerText = `${Math.floor(currentValue / 1000)}${suffix}`;
        } else {
          counter.innerText = currentValue + (progress === 1 && suffix && currentValue < 1000 ? suffix : "");
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = suffix === "K" ? `${target / 1000}${suffix}` : target;
        }
      };

      requestAnimationFrame(updateCount);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          counterObserver.unobserve(entry.target); 
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }


  /* ==========================================
     5. PERFORMANCE GARBAGE COLLECTION CLEANUP
     ========================================== */
  window.addEventListener("beforeunload", () => {
    if (typewriterTimerId) clearTimeout(typewriterTimerId);
  });

});