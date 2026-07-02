// --- 1. Hamburger Menu ---
window.toggleMenu = function(e) {
      if (e) e.stopPropagation();
      const menu = document.querySelector(".menu-links");
      const icon = document.querySelector(".hamburger-icon");
      menu.classList.toggle("open");
      icon.classList.toggle("open");
      document.body.style.overflow = menu.classList.contains("open") ? "hidden" : "auto"; 
}

document.addEventListener("click", (e) => {
      const menu = document.querySelector(".menu-links");
      const icon = document.querySelector(".hamburger-icon");
      if (menu && menu.classList.contains("open")) {
            if (e.target === menu || (!menu.contains(e.target) && !icon.contains(e.target))) {
                  menu.classList.remove("open");
                  icon.classList.remove("open");
                  document.body.style.overflow = "auto";
            }
      }
});

// --- 2. Smart Share Button ---
window.sharePortfolio = function() {
      const siteUrl = window.location.href; 
      if (navigator.share) {
            navigator.share({
                  title: 'Justin Loretz | Portfolio',
                  text: 'Check out the portfolio of Justin Loretz: Graphic Designer, Student, and Author.',
                  url: siteUrl
            }).catch(console.error); 
      } else if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(siteUrl).then(() => {
                  alert("Portfolio link copied to clipboard!");
            }).catch(console.error);
      } else {
            const textArea = document.createElement("textarea");
            textArea.value = siteUrl;
            textArea.style.position = "absolute";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.select();
            try {
                  document.execCommand('copy');
                  alert("Portfolio link copied to clipboard! (Local Test Mode)");
            } catch (err) {
                  console.error("Fallback copy failed", err);
            }
            document.body.removeChild(textArea);
      }
}

// --- 3. Modal Global Variables & Logic ---
let currentModalSlides = [];
let currentModalSlideIndex = 0;

window.openModal = function(projectElement) {
      const caseStudyData = projectElement.querySelector('.case-study-data').innerHTML;
      document.getElementById('modal-body-content').innerHTML = caseStudyData;

      const stack = document.getElementById('modal-body-content').querySelector('.presentation-stack');
      
      if (stack) {
            currentModalSlides = Array.from(stack.querySelectorAll('.presentation-slide'));
            currentModalSlideIndex = 0;

            currentModalSlides.forEach((slide, index) => {
                  slide.style.display = index === 0 ? 'block' : 'none';
                  slide.style.width = '100%'; 
                  slide.style.margin = '0 auto'; 
            });

            const leftArrow = document.createElement('button');
            leftArrow.innerHTML = '&#10094;';
            leftArrow.className = 'modal-slide-arrow left-arrow';
            leftArrow.onclick = function(e) { e.stopPropagation(); window.changeModalSlide(-1); };

            const rightArrow = document.createElement('button');
            rightArrow.innerHTML = '&#10095;';
            rightArrow.className = 'modal-slide-arrow right-arrow';
            rightArrow.onclick = function(e) { e.stopPropagation(); window.changeModalSlide(1); };

            stack.appendChild(leftArrow);
            stack.appendChild(rightArrow);
      }

      document.getElementById('project-modal').classList.add('show-modal');
      
      // HARD SCROLL LOCK: Freezes underlying viewport scrolling safely
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
}

window.changeModalSlide = function(direction) {
      if (currentModalSlides.length === 0) return;
      currentModalSlides[currentModalSlideIndex].style.display = 'none';
      const totalSlides = currentModalSlides.length;
      currentModalSlideIndex = (currentModalSlideIndex + direction + totalSlides) % totalSlides;
      currentModalSlides[currentModalSlideIndex].style.display = 'block';
}

window.closeModal = function() {
      const modal = document.getElementById('project-modal');
      if (modal) modal.classList.remove('show-modal');
      
      // RESTORE SCROLL: Restores native user scrolling fluidly
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      
      currentModalSlides = [];
      currentModalSlideIndex = 0;
}

// --- 3b. Native Modal Fullscreen Engine ---
window.toggleImgFullscreen = function() {
      const modalImg = document.getElementById('modal-body-content').querySelector('.modal-hero-img');
      
      if (!modalImg) return;

      if (!document.fullscreenElement) {
            if (modalImg.requestFullscreen) {
                  modalImg.requestFullscreen();
            } else if (modalImg.webkitRequestFullscreen) {
                  modalImg.webkitRequestFullscreen();
            } else if (modalImg.msRequestFullscreen) {
                  modalImg.msRequestFullscreen();
            }
      } else {
            if (document.exitFullscreen) {
                  document.exitFullscreen();
            }
      }
}

// --- 4. Global Carousel Engine & Sub-Filtering Logic ---
let currentCarouselIndex = 0;
let allCarouselItems = [];
let visibleCarouselItems = []; 

window.generateThumbnails = function() {
      const thumbContainer = document.getElementById('carousel-thumbnails');
      if (!thumbContainer) return;
      thumbContainer.innerHTML = ''; 

      visibleCarouselItems.forEach((item, index) => {
            const imgElement = item.querySelector('.carousel-img');
            if(!imgElement) return;

            const wrapper = document.createElement('div');
            wrapper.classList.add('thumbnail-wrapper');

            const thumb = document.createElement('img');
            thumb.classList.add('thumbnail-dot');
            thumb.src = imgElement.src; 

            wrapper.onclick = () => { 
                  currentCarouselIndex = index; 
                  window.updateCarousel(); 
            };
            wrapper.appendChild(thumb);
            thumbContainer.appendChild(wrapper);
      });
}

window.filterProjects = function(category) {
      document.querySelectorAll('.filter-btn').forEach(btn => {
            if (!btn.classList.contains('shsp-sub-btn')) {
                  btn.classList.remove('active-filter');
                  if (btn.getAttribute('onclick').includes(category)) btn.classList.add('active-filter');
            }
      });

      const mobileDropdown = document.getElementById('mobile-project-dropdown');
      if (mobileDropdown && mobileDropdown.value !== category) mobileDropdown.value = category;

      const thumbContainer = document.getElementById('carousel-thumbnails');
      if (thumbContainer) {
            if (category === 'featured') thumbContainer.classList.add('top-ten-mode');
            else thumbContainer.classList.remove('top-ten-mode');
      }

      const subFilterContainer = document.getElementById('shsp-sub-filters');
      if (subFilterContainer) {
            if (category === 'shsp') {
                  subFilterContainer.style.setProperty('display', 'flex', 'important');
                  document.querySelectorAll('.shsp-sub-btn').forEach(btn => btn.classList.remove('active-filter'));
                  const defaultSubBtn = document.querySelector('.shsp-sub-btn[onclick*="all"]');
                  if (defaultSubBtn) defaultSubBtn.classList.add('active-filter');
            } else {
                  subFilterContainer.style.setProperty('display', 'none', 'important');
            }
      }

      visibleCarouselItems = [];
    
      allCarouselItems.forEach(item => {
            item.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2'); 
            const isFeaturedMode = (category === 'featured' && item.getAttribute('data-featured') === 'true');
            const isCategoryMatch = (item.getAttribute('data-category') === category);

            if (isFeaturedMode || isCategoryMatch) {
                  item.classList.remove('hidden-project');
                  visibleCarouselItems.push(item);
            } else {
                  item.classList.add('hidden-project');
            }
      });

      currentCarouselIndex = 0;
      if (visibleCarouselItems.length > 0) {
            window.generateThumbnails(); 
            window.updateCarousel();
      } else {
            if (thumbContainer) thumbContainer.innerHTML = '';
      }
}

window.filterSHSPSub = function(subCategory) {
      document.querySelectorAll('.shsp-sub-btn').forEach(btn => {
            btn.classList.remove('active-filter');
            if (btn.getAttribute('onclick').includes(subCategory)) btn.classList.add('active-filter');
      });

      visibleCarouselItems = [];

      allCarouselItems.forEach(item => {
            item.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2');
            
            const isSHSP = item.getAttribute('data-category') === 'shsp';
            const isSubMatch = subCategory === 'all' || item.getAttribute('data-sub') === subCategory;

            if (isSHSP && isSubMatch) {
                  item.classList.remove('hidden-project');
                  visibleCarouselItems.push(item);
            } else {
                  item.classList.add('hidden-project');
            }
      });

      currentCarouselIndex = 0;
      if (visibleCarouselItems.length > 0) {
            window.generateThumbnails(); 
            window.updateCarousel();
      } else {
            const thumbContainer = document.getElementById('carousel-thumbnails');
            if (thumbContainer) thumbContainer.innerHTML = '';
      }
}

window.handleProjectClick = function(clickedElement) {
      const clickedIndex = visibleCarouselItems.indexOf(clickedElement);
      if (clickedIndex === currentCarouselIndex) window.openModal(clickedElement);
      else { currentCarouselIndex = clickedIndex; window.updateCarousel(); }
}

window.moveCarousel = function(direction) {
      const totalItems = visibleCarouselItems.length;
      if (totalItems === 0) return;
      currentCarouselIndex = (currentCarouselIndex + direction + totalItems) % totalItems;
      window.updateCarousel();
}

window.updateCarousel = function() {
      const totalItems = visibleCarouselItems.length;
      if (totalItems === 0) return;

      const thumbContainer = document.getElementById('carousel-thumbnails');
      const activeFilter = document.querySelector('.filter-btn.active-filter');
      const isTopTen = activeFilter ? activeFilter.innerText.includes('TOP TEN') : false;

      visibleCarouselItems.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2');

            if (index === currentCarouselIndex) item.classList.add('active');
            else if (index === currentCarouselIndex - 1 || (!isTopTen && totalItems >= 3 && index === (currentCarouselIndex - 1 + totalItems) % totalItems)) item.classList.add('prev'); 
            else if (index === currentCarouselIndex + 1 || (!isTopTen && totalItems >= 2 && index === (currentCarouselIndex + 1) % totalItems)) item.classList.add('next'); 
            else if (index === currentCarouselIndex - 2 || (!isTopTen && totalItems >= 5 && index === (currentCarouselIndex - 2 + totalItems) % totalItems)) item.classList.add('prev-2');
            else if (index === currentCarouselIndex + 2 || (!isTopTen && totalItems >= 4 && index === (currentCarouselIndex + 2) % totalItems)) item.classList.add('next-2');
      });

      const thumbs = document.querySelectorAll('.thumbnail-dot');
      thumbs.forEach((thumb, index) => {
            thumb.classList.remove('active-thumb');
            if (index === currentCarouselIndex) {
                  thumb.classList.add('active-thumb');
            }
      });

      if (thumbContainer) {
            if (isTopTen) {
                  thumbContainer.style.transform = 'none';
            } else {
                  const wrappers = Array.from(thumbContainer.querySelectorAll('.thumbnail-wrapper'));
                  const currentActiveWrapper = wrappers[currentCarouselIndex];

                  if (currentActiveWrapper) {
                        const wrapperOffsetLeft = currentActiveWrapper.offsetLeft;
                        const wrapperWidth = currentActiveWrapper.offsetWidth;
                        
                        const viewContainerWidth = thumbContainer.parentElement ? thumbContainer.parentElement.offsetWidth : window.innerWidth;
                        const centerXDist = (viewContainerWidth / 2) - (wrapperWidth / 2);
                        
                        let translateX = centerXDist - wrapperOffsetLeft;
                        thumbContainer.style.transform = `translateX(${translateX}px)`;
                  }
            }
      }
}

// --- 5. DOM Ready Execution & Listeners ---
document.addEventListener('DOMContentLoaded', () => {
      allCarouselItems = Array.from(document.querySelectorAll('.carousel-item'));

      const modalOverlay = document.getElementById('project-modal');
      if (modalOverlay) {
            modalOverlay.addEventListener('click', function(e) {
                  if (e.target === this || e.target.classList.contains('modal-hud-layer')) {
                        window.closeModal();
                  }
            });
      }

      // Ambient Star Particles (350 STABLE COUNT)
      function createStars() {
            const container = document.getElementById('particle-canvas');
            if (!container) return; 
            const starCount = 350; 
            for (let i = 0; i < starCount; i++) {
                  let star = document.createElement('div');
                  star.classList.add('star');
                  let size = Math.random() * 2.5 + 1.5; 
                  star.style.width = `${size}px`;
                  star.style.height = `${size}px`;
                  star.style.left = `${Math.random() * 100}vw`;
                  star.style.top = `${Math.random() * 100}vh`;
                  star.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 20}vw`);
                  star.style.setProperty('--drift-y', `${(Math.random() - 0.5) * 20}vh`);
                  star.style.animationDuration = `${Math.random() * 4 + 2.5}s`;
                  star.style.animationDelay = `${Math.random() * 5}s`;
                  container.appendChild(star);
            }
      }
      createStars();

      if (allCarouselItems.length > 0) window.filterProjects('featured'); 

      // --- 6. CLICK-RESET CAROUSEL AUTOPLAY ENGINE ---
      let carouselAutoplay = null;
      let isCarouselInView = false;
      let idleTimer = null;
      
      const IDLE_TIMEOUT = 3500; 
      const carouselArea = document.querySelector('.carousel-container');

      function startAutoplay() {
            if (visibleCarouselItems.length > 1 && !carouselAutoplay && isCarouselInView) {
                  carouselAutoplay = setInterval(() => window.moveCarousel(1), 4000);
            }
      }

      function stopAutoplay() { 
            if (carouselAutoplay) {
                  clearInterval(carouselAutoplay); 
                  carouselAutoplay = null; 
            }
      }

      function resetIdleTimer() {
            stopAutoplay(); 
            clearTimeout(idleTimer);
            
            if (isCarouselInView) {
                  idleTimer = setTimeout(() => {
                        startAutoplay();
                  }, IDLE_TIMEOUT);
            }
      }

      if (carouselArea) {
            const carouselObserver = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                        if (entry.isIntersecting) {
                              isCarouselInView = true;
                              resetIdleTimer();
                        } else {
                              isCarouselInView = false;
                              stopAutoplay();
                              clearTimeout(idleTimer);
                        }
                  });
            }, { 
                  threshold: 0.15 
            });

            carouselObserver.observe(carouselArea);

            document.addEventListener('click', resetIdleTimer, { passive: true });
            document.addEventListener('touchstart', resetIdleTimer, { passive: true });
      }

      // --- 7. Custom Brutalist Cursor ---
      const cursor = document.getElementById('custom-cursor');
      if (cursor) {
            document.addEventListener('mousemove', (e) => {
                  cursor.style.left = e.clientX + 'px';
                  cursor.style.top = e.clientY + 'px';
            });
            const clickables = document.querySelectorAll('a, button, .icon, .thumbnail-dot, .carousel-img, .carousel-arrow, .clickable');
            clickables.forEach(el => {
                  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
                  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
            });
      }

      // --- 8. Bottom Scroll Progress Bar ---
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) {
            window.addEventListener('scroll', () => {
                  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                  progressBar.style.width = ((scrollTop / scrollHeight) * 100) + '%';
            });
      }

      // --- 9. Cinematic Scroll Reveals ---
      const cardsToReveal = document.querySelectorAll('.details-container, .contact-info-upper-container, .about-pic, .experience-sub-title');
      cardsToReveal.forEach(card => card.classList.add('reveal-on-scroll'));

      const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                  if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target); 
                  }
            });
          }, { threshold: 0.15 });

      cardsToReveal.forEach(card => revealObserver.observe(card));

      // --- 10. Article Sorting Logic ---
      window.sortArticles = function() {
            const container = document.querySelector('.editorial-index-container');
            if (!container) return;
            const rows = Array.from(container.querySelectorAll('.editorial-row'));
            const sortType = document.getElementById('article-sort').value;

            rows.sort((a, b) => {
                  if (sortType === 'views') return parseInt(b.dataset.views) - parseInt(a.dataset.views);
                  else if (sortType === 'oldest') return new Date(a.dataset.date) - new Date(b.dataset.date);
                  else return new Date(b.dataset.date) - new Date(a.dataset.date);
            });
            rows.forEach(row => container.appendChild(row));
      }

      // --- 11. RE-ANCHORED SCROLL-ACTIVATED HEADER ENGINE ---
      const globalHeaders = document.querySelectorAll('.section-header-trigger');
      if (globalHeaders.length > 0) {
            const headerObserver = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                        if (entry.isIntersecting) {
                              entry.target.classList.add('start-reveal');
                              headerObserver.unobserve(entry.target); 
                        }
                  });
            }, { threshold: 0.1 });

            globalHeaders.forEach(header => headerObserver.observe(header));
      }
});

// --- 12. Magnetic 3D Holographic Tilt (The "Prizm" Effect) ---
const tiltCards = document.querySelectorAll('.bento-tile, .details-container');

tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.setProperty('transform', `perspective(1000px) translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, 'important');
            
            const shadowX = ((x - centerX) / centerX) * -25;
            const shadowY = ((y - centerY) / centerY) * -25;
            card.style.setProperty('box-shadow', `${shadowX}px ${shadowY}px 50px rgba(0, 68, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 0 20px rgba(0, 68, 255, 0.2)`, 'important');
      });
      
      card.addEventListener('mouseleave', () => {
            card.style.removeProperty('transform');
            card.style.removeProperty('box-shadow');
      });
});

// --- 13. The Vault Preloader ---
setTimeout(() => {
      document.body.classList.add('vault-open');
      setTimeout(() => {
            const vault = document.getElementById('vault-preloader');
            if (vault) vault.style.display = 'none';
      }, 2200); 
}, 2200);