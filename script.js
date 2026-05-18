// --- 1. Hamburger Menu (Global Scope) ---
function toggleMenu() {
      const menu = document.querySelector(".menu-links");
      const icon = document.querySelector(".hamburger-icon");
      menu.classList.toggle("open");
      icon.classList.toggle("open");
}

// --- 2. Smart Share Button (Global Scope) ---
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

// --- ALL OTHER SCRIPTS WAITING FOR THE HTML TO LOAD ---
document.addEventListener('DOMContentLoaded', () => {

      // --- 3. Premium Slab 3D Tilt Effect ---
      const tiltCard = document.getElementById('tilt-card');

      if (tiltCard) {
            let ticking = false; 

            tiltCard.addEventListener('mousemove', (e) => {
                  const mouseX = e.clientX;
                  const mouseY = e.clientY;

                  if (!ticking) {
                        window.requestAnimationFrame(() => {
                              const rect = tiltCard.getBoundingClientRect();
                              const x = mouseX - rect.left;
                              const y = mouseY - rect.top;
                              
                              const centerX = rect.width / 2;
                              const centerY = rect.height / 2;
                              
                              const rotateX = ((y - centerY) / centerY) * -15; 
                              const rotateY = ((x - centerX) / centerX) * 15;
                              
                              tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                              tiltCard.style.boxShadow = `${-rotateY}px ${rotateX}px 40px var(--accent)`;
                              tiltCard.style.transition = 'none'; 
                              
                              ticking = false; 
                        });
                        ticking = true; 
                  }
            });

            tiltCard.addEventListener('mouseleave', () => {
                  tiltCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                  tiltCard.style.boxShadow = `25px 25px 0px var(--accent)`;
                  tiltCard.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
            });
      }

      // --- 4. Ambient Star Particles ---
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

      // --- 5. Carousel, Filters, & Modal Logic ---
      let currentCarouselIndex = 0;
      let allCarouselItems = Array.from(document.querySelectorAll('.carousel-item'));
      let visibleCarouselItems = [...allCarouselItems]; 

      if (visibleCarouselItems.length > 0) {
            updateCarousel(); 
      }

      // Filter Logic
      window.filterProjects = function(category) {
            // Safely grab the button that was clicked and update colors
            const clickedBtn = window.event ? window.event.currentTarget : null;
            if (clickedBtn) {
                  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active-filter'));
                  clickedBtn.classList.add('active-filter');
            }

            visibleCarouselItems = [];
            allCarouselItems.forEach(item => {
                  item.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2'); 
                  
                  if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.classList.remove('hidden-project');
                        visibleCarouselItems.push(item);
                  } else {
                        item.classList.add('hidden-project');
                  }
            });

            currentCarouselIndex = 0;
            if (visibleCarouselItems.length > 0) {
                  updateCarousel();
            }
      }

      // Click Logic (Spin vs. Open Modal)
      window.handleProjectClick = function(clickedElement) {
            const clickedIndex = visibleCarouselItems.indexOf(clickedElement);

            if (clickedIndex === currentCarouselIndex) {
                  openModal(clickedElement);
            } else {
                  currentCarouselIndex = clickedIndex;
                  updateCarousel();
            }
      }

      // Carousel Math
      function updateCarousel() {
            const totalItems = visibleCarouselItems.length;

            visibleCarouselItems.forEach((item, index) => {
                  item.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2');

                  if (index === currentCarouselIndex) {
                        item.classList.add('active');
                  } else if (index === (currentCarouselIndex - 1 + totalItems) % totalItems) {
                        item.classList.add('prev');
                  } else if (index === (currentCarouselIndex + 1) % totalItems) {
                        item.classList.add('next');
                  } else if (index === (currentCarouselIndex - 2 + totalItems) % totalItems) {
                        item.classList.add('prev-2');
                  } else if (index === (currentCarouselIndex + 2) % totalItems) {
                        item.classList.add('next-2');
                  }
            });
      }

      window.moveCarousel = function(direction) {
            if (visibleCarouselItems.length === 0) return;
            const totalItems = visibleCarouselItems.length;
            currentCarouselIndex = (currentCarouselIndex + direction + totalItems) % totalItems;
            updateCarousel();
      }

      // Modal Functions
      window.openModal = function(projectElement) {
            const caseStudyData = projectElement.querySelector('.case-study-data').innerHTML;
            document.getElementById('modal-body-content').innerHTML = caseStudyData;
            document.getElementById('project-modal').classList.add('show-modal');
            document.body.style.overflow = "hidden";
      }

      window.closeModal = function() {
            document.getElementById('project-modal').classList.remove('show-modal');
            document.body.style.overflow = "auto";
      }
});