document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Loader Logic
    const loader = document.getElementById('preloader');
    const minLoadTime = 1800; // Extended for proper loading
    const startTime = Date.now();
    let hidden = false;

    function hideLoader() {
        if (hidden) return;
        hidden = true;
        
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);

        setTimeout(() => {
            document.body.classList.add('loaded');
            // Remove from DOM after transition
            setTimeout(() => {
                if(loader) loader.style.display = 'none'; 
            }, 600); 
        }, remainingTime);
    }

    // Use window load to ensure images are ready
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
        setTimeout(hideLoader, 3000); // Fallback
    } 

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Fetch data and populate portfolio
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            populatePersonalInfo(data.personalInfo);
            // 1. Setup Filters first
            setupFilters(data.works);
            // 2. Populate Gallery initially with all works
            populateGallery(data.works);
            // 3. Setup Marquee
            setupHeroMarquee(data.works);
            // 4. Initial Scroll Animation setup
            setupScrollAnimation();
        })
        .catch(error => console.error('Error loading portfolio data:', error));

    // Lightbox functionality
    setupLightbox();
});

// MARQUEE (Film Reel)
function setupHeroMarquee(works) {
    const marqueeTrack = document.getElementById('hero-bg');
    if (!works || works.length === 0) return;

    // Use only a subset to keep performance high if there are too many works
    // But duplicate enough times to span screen width + buffer
    let marqueeItems = [...works];

    // Ensure we have enough items for a smooth loop (at least 10 items total)
    while (marqueeItems.length < 10) {
        marqueeItems = [...marqueeItems, ...works];
    }
    
    // Clear and rebuild
    marqueeTrack.innerHTML = ''; 

    // Helper to create item
    const createItem = (work) => {
        const item = document.createElement('div');
        item.className = 'marquee-item';
        // Eager loading for marquee images to prevent pop-in during animation
        item.innerHTML = `<img src="${work.image}" alt="" loading="eager" decoding="async">`;
        return item;
    };

    // 1. Append original set
    marqueeItems.forEach(work => marqueeTrack.appendChild(createItem(work)));

    // 2. Append clone set immediately (for the seamless loop effect)
    // We clone the ENTIRE set we just created to ensure 0% -> -50% translation is perfect
    marqueeItems.forEach(work => {
        const clone = createItem(work);
        clone.setAttribute('aria-hidden', 'true'); // Accessibility: hide duplicate content
        marqueeTrack.appendChild(clone);
    });
}

// FILTERS
let allWorks = []; // Store globally to filter against

function setupFilters(works) {
    allWorks = works; // Save for filtering
    const filterContainer = document.getElementById('filters');
    
    // Get unique categories
    const categories = new Set();
    works.forEach(work => {
        categories.add(work.category);
    });

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = cat;
        btn.dataset.filter = cat;
        btn.onclick = () => handleFilterClick(btn, cat);
        filterContainer.appendChild(btn);
    });

    // Add click handler to "All" button
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if(allBtn) allBtn.onclick = (e) => handleFilterClick(e.target, 'all');
}

function handleFilterClick(btn, category) {
    // Update active state
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter items
    const filtered = category === 'all' 
        ? allWorks 
        : allWorks.filter(work => work.category === category);
    
    // Clear and re-populate
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; 
    populateGallery(filtered);
}

function setupScrollAnimation() {
    // Disconnect old observer if needed or just create new one for new items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => observer.observe(item));
}

function populatePersonalInfo(info) {
    document.title = `${info.name} | ${info.title}`;
    document.getElementById('nav-name').textContent = info.name + '.';
    document.getElementById('hero-name').textContent = info.name;
    document.getElementById('hero-title').textContent = info.title;
    document.getElementById('about-bio').textContent = info.bio;
    
    document.getElementById('footer-name').textContent = info.name;

    const contactContainer = document.getElementById('contact-buttons');
    
    if (info.socials && info.socials.messenger) {
        const messengerBtn = document.createElement('a');
        messengerBtn.href = info.socials.messenger;
        messengerBtn.target = '_blank';
        messengerBtn.rel = 'noopener noreferrer';
        messengerBtn.className = 'contact-btn messenger-btn';
        messengerBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            Messenger
        `;
        contactContainer.appendChild(messengerBtn);
    }

    if (info.socials && info.socials.instagram) {
        const instaBtn = document.createElement('a');
        instaBtn.href = info.socials.instagram;
        instaBtn.target = '_blank';
        instaBtn.rel = 'noopener noreferrer';
        instaBtn.className = 'contact-btn instagram-btn';
        instaBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            Instagram
        `;
        contactContainer.appendChild(instaBtn);
    }
}

function populateGallery(works) {
    const gallery = document.getElementById('gallery');
    
    works.forEach((work, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        // Add staggered delay for initial load if visible
        item.style.transitionDelay = `${index * 50}ms`;
        
        item.onclick = () => openLightbox(work);

        item.innerHTML = `
            <img src="${work.image}" alt="${work.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/800x1000?text=Image+Not+Found'">
            <div class="item-overlay">
                <span class="item-category">${work.category}</span>
                <h3 class="item-title">${work.title}</h3>
            </div>
        `;
        
        gallery.appendChild(item);
    });

    // Initialize scroll animation for these new items
    setupScrollAnimation();
}

// Lightbox Logic
let lightbox, lightboxImg, lightboxCaption, closeBtn;

function setupLightbox() {
    lightbox = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightbox-img');
    lightboxCaption = document.getElementById('lightbox-caption');
    closeBtn = document.querySelector('.close-lightbox');

    closeBtn.onclick = closeLightbox;

    lightbox.onclick = function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });
}

function openLightbox(work) {
    lightbox.style.display = 'flex'; // Changed to flex for better centering
    lightboxImg.src = work.image;
    // Fallback if image is missing
    lightboxImg.onerror = function() {
        this.src = 'https://via.placeholder.com/800x1000?text=Image+Not+Found';
    };
    
    // Create detailed caption with CTA button
    lightboxCaption.innerHTML = `
        <h3 style="font-size:1.5rem; margin-bottom:0.5rem; color:#fff;">${work.title}</h3>
        <p style="font-size:1rem; font-family:var(--font-sans); color:#aaa; margin-bottom:2rem; line-height:1.6;">${work.description}</p>
        <a href="#contact" onclick="closeLightbox()" class="lightbox-cta">
            Want a similar design?
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:8px;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </a>
    `;
    
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}