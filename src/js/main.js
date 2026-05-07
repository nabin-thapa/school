// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', () => {
    // Hide loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 500);
        }, 500);
    }

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Sticky Navbar Setup
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('glass-nav', 'shadow-md');
                navbar.classList.remove('bg-transparent', 'py-4');
                navbar.classList.add('py-2');
            } else {
                navbar.classList.remove('glass-nav', 'shadow-md');
                if(document.body.classList.contains('home-page')) {
                    navbar.classList.add('bg-transparent');
                } else {
                    navbar.classList.add('bg-white', 'shadow-sm');
                }
                navbar.classList.add('py-4');
                navbar.classList.remove('py-2');
            }
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });
    }
    
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    }

    // Counter Animation for Stats
    const stats = document.querySelectorAll('.stat-number');
    if(stats.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    const stat = entry.target;
                    const target = parseInt(stat.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCounter();
                    observer.unobserve(stat);
                }
            });
        });
        
        stats.forEach(stat => observer.observe(stat));
    }

    // Lightbox for Gallery
    const galleryItems = document.querySelectorAll('.gallery-item');
    if(galleryItems.length > 0) {
        // Simple lightbox implementation
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'fixed inset-0 bg-black/90 z-[100] hidden flex-col items-center justify-center p-4';
        
        const img = document.createElement('img');
        img.className = 'max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl';
        
        const caption = document.createElement('p');
        caption.className = 'text-white mt-4 text-xl font-medium';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i data-lucide="x" class="w-8 h-8 text-white"></i>';
        closeBtn.className = 'absolute top-6 right-6 hover:text-secondary-500 transition';
        closeBtn.onclick = () => lightbox.classList.add('hidden');
        
        lightbox.appendChild(img);
        lightbox.appendChild(caption);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);
        
        // Re-init icons for the newly added close button
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const imgSrc = item.querySelector('img').src;
                const imgAlt = item.querySelector('img').alt;
                img.src = imgSrc;
                caption.textContent = imgAlt;
                lightbox.classList.remove('hidden');
                lightbox.classList.add('flex');
            });
        });
    }
});
