/**
 * Health On Wheels - JavaScript Main File
 * Handles navigation, theme switching, animations, and interactions
 */

// ===== DOM ELEMENTS =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const progressBar = document.getElementById('progressBar');
const navLinks = document.querySelectorAll('.nav-link');
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

// ===== STATE MANAGEMENT =====
let isMenuOpen = false;
let currentTheme = localStorage.getItem('theme') || 'light';
let isScrolling = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeNavigation();
    initializeProgressBar();
    initializeScrollAnimations();
    initializeStatCounters();
    initializeSmoothScrolling();
    initializeAccessibility();
});

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

function updateThemeIcon() {
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    themeIcon.setAttribute('aria-label', currentTheme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair');
}

// ===== NAVIGATION =====
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                scrollToSection(targetSection);
                updateActiveLink(link);
                closeMobileMenu();
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(updateActiveNavLink);
        }
    });
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isMenuOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    isMenuOpen = false;
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

function updateActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (correspondingLink) {
                updateActiveLink(correspondingLink);
            }
        }
    });
    
    isScrolling = false;
}

// ===== PROGRESS BAR =====
function initializeProgressBar() {
    window.addEventListener('scroll', updateProgressBar);
}

function updateProgressBar() {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    scrollToSection(targetElement);
                }
            }
        });
    });
}

function scrollToSection(element) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = element.offsetTop - headerHeight - 20;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animation classes based on element type
                if (element.classList.contains('stat-card')) {
                    element.classList.add('animate-fadeInUp');
                } else if (element.classList.contains('problem-card')) {
                    element.classList.add('animate-slideInLeft');
                } else if (element.classList.contains('solution-card')) {
                    element.classList.add('animate-slideInRight');
                } else if (element.classList.contains('stakeholder-card')) {
                    element.classList.add('animate-fadeInUp');
                } else if (element.classList.contains('impact-card')) {
                    element.classList.add('animate-fadeInUp');
                } else {
                    element.classList.add('animate-fadeIn');
                }
                
                // Start stat counter if it's a stat card
                if (element.classList.contains('stat-card')) {
                    const statNumber = element.querySelector('.stat-number[data-target]');
                    if (statNumber && !statNumber.classList.contains('counted')) {
                        startCounter(statNumber);
                        statNumber.classList.add('counted');
                    }
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.stat-card, .problem-card, .solution-card, .stakeholder-card, .impact-card, .cost-card'
    );
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== STAT COUNTERS =====
function initializeStatCounters() {
    // Initial check for visible stats
    const visibleStats = document.querySelectorAll('.stat-card .stat-number[data-target]');
    visibleStats.forEach(stat => {
        const rect = stat.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (!stat.classList.contains('counted')) {
                startCounter(stat);
                stat.classList.add('counted');
            }
        }
    });
}

function startCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
}

// ===== ACCESSIBILITY =====
function initializeAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
            navToggle.focus();
        }
        
        // Tab trap for mobile menu
        if (e.key === 'Tab' && isMenuOpen) {
            const focusableElements = navMenu.querySelectorAll(
                'a, button, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Aller au contenu principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add role="main" to main element if not present
    const main = document.querySelector('main');
    if (main && !main.hasAttribute('role')) {
        main.setAttribute('role', 'main');
        main.id = 'main';
    }
    
    // Enhanced focus management
    enhanceFocusManagement();
}

function enhanceFocusManagement() {
    // Add focus indicators to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    
    interactiveElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.setAttribute('data-focused', 'true');
        });
        
        element.addEventListener('blur', () => {
            element.removeAttribute('data-focused');
        });
    });
    
    // Announce page changes to screen readers
    announcePageChanges();
}

function announcePageChanges() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'announcements';
    document.body.appendChild(liveRegion);
    
    // Announce navigation changes
    const observer = new MutationObserver(() => {
        const activeSection = document.querySelector('.nav-link.active');
        if (activeSection) {
            announceToScreenReader(`Section ${activeSection.textContent} affichée`);
        }
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true
    });
}

function announceToScreenReader(message) {
    const announcements = document.getElementById('announcements');
    if (announcements) {
        announcements.textContent = message;
        setTimeout(() => {
            announcements.textContent = '';
        }, 1000);
    }
}

// ===== EXPLOSIVE INTERACTIONS =====
function initializeExplosiveEffects() {
    // Add explosive click effects to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', createExplosiveRipple);
    });
    
    // Add hover energy to cards
    document.querySelectorAll('.stat-card, .problem-card, .solution-card, .stakeholder-card').forEach(card => {
        card.addEventListener('mouseenter', createEnergyField);
        card.addEventListener('mouseleave', removeEnergyField);
    });
    
    // Add particle effects on scroll
    initializeParticleEffects();
}

function createExplosiveRipple(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: rippleExplosion 0.6s ease-out;
    `;
    
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

function createEnergyField(e) {
    const card = e.currentTarget;
    card.style.transform = 'translateY(-8px) scale(1.02)';
    card.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.4)';
}

function removeEnergyField(e) {
    const card = e.currentTarget;
    card.style.transform = '';
    card.style.boxShadow = '';
}

function initializeParticleEffects() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    hero.addEventListener('mousemove', createParticle);
}

function createParticle(e) {
    const hero = e.currentTarget;
    const particle = document.createElement('div');
    
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        pointer-events: none;
        animation: particleFloat 2s ease-out forwards;
    `;
    
    const rect = hero.getBoundingClientRect();
    particle.style.left = (e.clientX - rect.left) + 'px';
    particle.style.top = (e.clientY - rect.top) + 'px';
    
    hero.appendChild(particle);
    
    setTimeout(() => particle.remove(), 2000);
}

// Add CSS for explosive animations
const explosiveStyles = document.createElement('style');
explosiveStyles.textContent = `
    @keyframes rippleExplosion {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
    
    @keyframes particleFloat {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx, 100px), -100px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(explosiveStyles);

// ===== TEAM MODALS =====
function openMemberModal(memberId) {
    const modal = document.getElementById(memberId + 'Modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
        
        // Announce to screen readers
        announceToScreenReader(`Fiche de l'équipe ${memberId} ouverte`);
    }
}

function closeMemberModal(memberId) {
    const modal = document.getElementById(memberId + 'Modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to the button that opened the modal
        const memberBtn = document.querySelector(`[onclick="openMemberModal('${memberId}')"]`);
        if (memberBtn) {
            memberBtn.focus();
        }
        
        // Announce to screen readers
        announceToScreenReader(`Fiche de l'équipe ${memberId} fermée`);
    }
}

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.member-modal.active');
        if (activeModal) {
            const modalId = activeModal.id.replace('Modal', '');
            closeMemberModal(modalId);
        }
    }
});

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        const activeModal = document.querySelector('.member-modal.active');
        if (activeModal) {
            const modalId = activeModal.id.replace('Modal', '');
            closeMemberModal(modalId);
        }
    }
});

// Add keyboard navigation within modals
document.addEventListener('keydown', (e) => {
    const activeModal = document.querySelector('.member-modal.active');
    if (!activeModal) return;
    
    if (e.key === 'Tab') {
        const focusableElements = activeModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// Remove unused modal functions
// function openMemberModal(memberId) - kept
// function closeMemberModal(memberId) - kept

// Initialize explosive effects
document.addEventListener('DOMContentLoaded', initializeExplosiveEffects);
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) {
            cancelAnimationFrame(scrollTimer);
        }
        scrollTimer = requestAnimationFrame(() => {
            isScrolling = true;
        });
    });
    
    // Lazy load images when needed
    lazyLoadImages();
    
    // Optimize animations for reduced motion
    respectReducedMotion();
}

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

function respectReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable animations
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Fallback for critical functionality
    if (e.message.includes('navMenu')) {
        console.warn('Navigation error - using fallback');
        navMenu.style.display = 'block';
    }
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize performance optimizations
optimizePerformance();

// ===== SERVICE WORKER REGISTRATION (for PWA support) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker if available
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== ANALYTICS TRACKING (placeholder) =====
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Track Event:', eventName, properties);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
}

// Track button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        trackEvent('button_click', {
            button_text: buttonText,
            button_type: button.className
        });
    });
});

// Track section views
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionName = entry.target.id || 'unknown';
            trackEvent('section_view', {
                section_name: sectionName
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});
