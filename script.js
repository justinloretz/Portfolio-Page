// --- 1. Hamburger Menu ---
window.toggleMenu = function(e) {
      if (e) e.stopPropagation();
      const menu = document.querySelector(".menu-links");
      const icon = document.querySelector(".hamburger-icon");
      menu.classList.toggle("open");
      icon.classList.toggle("open");
      
      // Locks the background from scrolling while menu is open
      if (menu.classList.contains("open")) {
          document.body.style.overflow = "hidden"; 
      } else {
          document.body.style.overflow = "auto";
      }
}

// Closes menu when clicking ANYWHERE on the background overlay
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

// --- ALL OTHER SCRIPTS WAITING FOR HTML ---
document.addEventListener('DOMContentLoaded', () => {

      // --- 3. Ambient Star Particles ---
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

      // --- 4. Carousel & Filter Logic ---
      let currentCarouselIndex = 0;
      let allCarouselItems = Array.from(document.querySelectorAll('.carousel-item'));
      let visibleCarouselItems = []; 

      function generateThumbnails() {
            const thumbContainer = document.getElementById('carousel-thumbnails');
            if (!thumbContainer) return;
            thumbContainer.innerHTML = ''; 

            visibleCarouselItems.forEach((item, index) => {
                  const imgElement = item.querySelector('.carousel-img');
                  if(!imgElement) return;

                  // NEW: The invisible wrapper that holds the image AND the background number
                  const wrapper = document.createElement('div');
                  wrapper.classList.add('thumbnail-wrapper');

                  const thumb = document.createElement('img');
                  thumb.classList.add('thumbnail-dot');
                  thumb.src = imgElement.src; 

                  // Make the whole wrapper clickable
                  wrapper.onclick = () => {
                        currentCarouselIndex = index;
                        updateCarousel();
                  };

                  wrapper.appendChild(thumb);
                  thumbContainer.appendChild(wrapper);
            });
      }

window.filterProjects = function(category) {
      // 1. Toggles desktop buttons
      document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active-filter');
            if (btn.getAttribute('onclick').includes(category)) {
                  btn.classList.add('active-filter');
            }
      });

      // 2. Syncs the mobile dropdown
      const mobileDropdown = document.getElementById('mobile-project-dropdown');
      if (mobileDropdown && mobileDropdown.value !== category) {
            mobileDropdown.value = category;
      }

      // 3. Toggles the "Top Ten Mode" for the CSS to read
      const thumbContainer = document.getElementById('carousel-thumbnails');
      if (thumbContainer) {
            if (category === 'featured') {
                  thumbContainer.classList.add('top-ten-mode');
            } else {
                  thumbContainer.classList.remove('top-ten-mode');
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
            generateThumbnails(); 
            updateCarousel();
      } else {
            if (thumbContainer) thumbContainer.innerHTML = '';
      }
}
      if (allCarouselItems.length > 0) {
            filterProjects('featured'); 
      }
      
      window.handleProjectClick = function(clickedElement) {
            const clickedIndex = visibleCarouselItems.indexOf(clickedElement);

            if (clickedIndex === currentCarouselIndex) {
                  openModal(clickedElement);
            } else {
                  currentCarouselIndex = clickedIndex;
                  updateCarousel();
            }
      }
function updateCarousel() {
            const totalItems = visibleCarouselItems.length;
            const isTopTen = document.querySelector('.filter-btn.active-filter').innerText.includes('TOP TEN');

            visibleCarouselItems.forEach((item, index) => {
                  item.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2');

                  if (index === currentCarouselIndex) {
                        item.classList.add('active');
                  } else if (index === currentCarouselIndex - 1 || (!isTopTen && totalItems >= 3 && index === (currentCarouselIndex - 1 + totalItems) % totalItems)) {
                        item.classList.add('prev'); /* Shows on the left */
                  } else if (index === currentCarouselIndex + 1 || (!isTopTen && totalItems >= 2 && index === (currentCarouselIndex + 1) % totalItems)) {
                        item.classList.add('next'); /* Shows on the right */
                  } else if (index === currentCarouselIndex - 2 || (!isTopTen && totalItems >= 5 && index === (currentCarouselIndex - 2 + totalItems) % totalItems)) {
                        item.classList.add('prev-2');
                  } else if (index === currentCarouselIndex + 2 || (!isTopTen && totalItems >= 4 && index === (currentCarouselIndex + 2) % totalItems)) {
                        item.classList.add('next-2');
                  }
            });

            const thumbs = document.querySelectorAll('.thumbnail-dot');
            thumbs.forEach((thumb, index) => {
                  if (index === currentCarouselIndex) thumb.classList.add('active-thumb');
                  else thumb.classList.remove('active-thumb');
            });
      }

      window.moveCarousel = function(direction) {
            if (visibleCarouselItems.length === 0) return;
            const totalItems = visibleCarouselItems.length;
            const isTopTen = document.querySelector('.filter-btn.active-filter').innerText.includes('TOP TEN');
            
            let newIndex = currentCarouselIndex + direction;
            
            if (isTopTen) {
                  // Hard stop: Don't wrap around in Top 10 mode
                  if (newIndex < 0 || newIndex >= totalItems) return; 
                  currentCarouselIndex = newIndex;
            } else {
                  // Wrap around normally for other filters
                  currentCarouselIndex = (newIndex + totalItems) % totalItems;
            }
            updateCarousel();
      }

      // --- 5. Modal Navigation Logic ---
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
                  leftArrow.onclick = function(e) {
                        e.stopPropagation(); 
                        window.changeModalSlide(-1);
                  };

                  const rightArrow = document.createElement('button');
                  rightArrow.innerHTML = '&#10095;';
                  rightArrow.className = 'modal-slide-arrow right-arrow';
                  rightArrow.onclick = function(e) {
                        e.stopPropagation(); 
                        window.changeModalSlide(1);
                  };

                  stack.appendChild(leftArrow);
                  stack.appendChild(rightArrow);
            }

            document.getElementById('project-modal').classList.add('show-modal');
            document.body.style.overflow = "hidden";
      }

      window.changeModalSlide = function(direction) {
            if (currentModalSlides.length === 0) return;

            currentModalSlides[currentModalSlideIndex].style.display = 'none';
            const totalSlides = currentModalSlides.length;
            currentModalSlideIndex = (currentModalSlideIndex + direction + totalSlides) % totalSlides;
            currentModalSlides[currentModalSlideIndex].style.display = 'block';
      }

      window.closeModal = function() {
            document.getElementById('project-modal').classList.remove('show-modal');
            document.body.style.overflow = "auto";
            
            currentModalSlides = [];
            currentModalSlideIndex = 0;
      }

      // --- 6. Custom Brutalist Cursor ---
      const cursor = document.getElementById('custom-cursor');
      if (cursor) {
            document.addEventListener('mousemove', (e) => {
                  cursor.style.left = e.clientX + 'px';
                  cursor.style.top = e.clientY + 'px';
            });

            const clickables = document.querySelectorAll('a, button, .icon, .thumbnail-dot, .carousel-img, .carousel-arrow');
            clickables.forEach(el => {
                  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
                  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
            });
      }

      // --- 7. Bottom Scroll Progress Bar ---
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) {
            window.addEventListener('scroll', () => {
                  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                  const scrollPercent = (scrollTop / scrollHeight) * 100;
                  progressBar.style.width = scrollPercent + '%';
            });
      }

      // --- 8. Cinematic Scroll Reveals ---
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

      // --- 9. The Vault Preloader ---
      setTimeout(() => {
            document.body.classList.add('vault-open');
            setTimeout(() => {
                  const vault = document.getElementById('vault-preloader');
                  if (vault) vault.style.display = 'none';
            }, 2200); 
      }, 2200);

      // --- 10. Article Sorting Logic ---
      window.sortArticles = function() {
            const container = document.querySelector('.editorial-index-container');
            const rows = Array.from(container.querySelectorAll('.editorial-row'));
            const sortType = document.getElementById('article-sort').value;

            rows.sort((a, b) => {
                  if (sortType === 'views') {
                        return parseInt(b.dataset.views) - parseInt(a.dataset.views);
                  } else if (sortType === 'oldest') {
                        return new Date(a.dataset.date) - new Date(b.dataset.date);
                  } else { // Newest (Default)
                        return new Date(b.dataset.date) - new Date(a.dataset.date);
                  }
            });

            // Re-append rows in the new sorted order
            rows.forEach(row => container.appendChild(row));
      }

});