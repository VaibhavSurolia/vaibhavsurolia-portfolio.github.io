// ========================================
// GLASSMORPHIC PORTFOLIO - SCRIPTS
// Modern Interactive Features
// ========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initTypingEffect();
    initParallax();
    initLiquidIndicator();
    fetchLeetCodeStats();
});

// ===== LEETCODE STATS =====
async function fetchLeetCodeStats() {
    const username = 'VaibhavSurolia';

    // Try the primary API
    try {
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
        const data = await response.json();

        if (data.status === 'success') {
            updateLeetCodeUI(data);
            return;
        }
    } catch (error) {
        console.log('Primary API failed:', error);
    }

    // Fallback to static data if API fails
    console.log('Using fallback data');
    updateLeetCodeUI({
        totalSolved: 31,
        easySolved: 27,
        mediumSolved: 4,
        hardSolved: 0,
        totalEasy: 922,
        totalMedium: 1996,
        totalHard: 903,
        acceptanceRate: 53.42,
        ranking: 3192336,
        // Real submission calendar data from Jan 2026
        submissionCalendar: {
            "1769385600": 3,  // Jan 26
            "1769299200": 1,  // Jan 25
            "1769212800": 7,  // Jan 24
            "1769126400": 2,  // Jan 23
            "1769040000": 5   // Jan 22
        }
    });
}

function updateLeetCodeUI(data) {
    // Safely update elements (check if they exist first)
    const setTextContent = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    // Update Total Solved
    setTextContent('lc-total', data.totalSolved);

    // Update Ranking (format with commas)
    setTextContent('lc-rank', formatNumber(data.ranking));

    // Update Acceptance Rate
    setTextContent('lc-acceptance', `${data.acceptanceRate}%`);

    // Update difficulty breakdown
    setTextContent('lc-easy', `${data.easySolved}/${data.totalEasy}`);
    setTextContent('lc-medium', `${data.mediumSolved}/${data.totalMedium}`);
    setTextContent('lc-hard', `${data.hardSolved}/${data.totalHard}`);

    // Animate progress bars
    setTimeout(() => {
        const easyPercent = (data.easySolved / data.totalEasy) * 100;
        const mediumPercent = (data.mediumSolved / data.totalMedium) * 100;
        const hardPercent = (data.hardSolved / data.totalHard) * 100;

        const setWidth = (id, percent) => {
            const el = document.getElementById(id);
            if (el) el.style.width = `${percent}%`;
        };

        setWidth('lc-easy-bar', easyPercent);
        setWidth('lc-medium-bar', mediumPercent);
        setWidth('lc-hard-bar', hardPercent);
    }, 500);

    // Calculate streak and today's submissions from calendar
    const calendar = data.submissionCalendar || {};
    const today = getTodayTimestamp();
    const yesterday = today - 86400;

    // Solved today
    const solvedToday = calendar[today] || 0;
    setTextContent('lc-today', solvedToday);

    // Calculate streak
    let streak = 0;
    let checkDate = solvedToday > 0 ? today : yesterday;

    while (calendar[checkDate] && calendar[checkDate] > 0) {
        streak++;
        checkDate -= 86400;
    }

    // Animate streak counter from 0 to final value
    animateCounter('lc-streak', streak, 1500);
    animateCounter('hero-streak', streak, 1500);
}

// Animate a number counting up from 0 to target value
function animateCounter(elementId, targetValue, duration = 1000) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Less aggressive easing - easeOutQuad for smoother counting
        const easeOutQuad = 1 - Math.pow(1 - progress, 2);

        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuad);
        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue; // Ensure exact final value
            // Add golden glow animation on completion
            element.classList.add('streak-glow');
        }
    }

    requestAnimationFrame(updateCounter);
}

// Helper function to format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Get today's timestamp at midnight UTC
function getTodayTimestamp() {
    const now = new Date();
    const utcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return Math.floor(utcMidnight / 1000);
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        toggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggle.textContent = '☰';
        });
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const texts = [
        'Full-Stack Developer',
        'UI/UX Designer',
        'Creative Problem Solver'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before typing new text
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

// ===== PARALLAX EFFECT =====
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===== NAVBAR BACKGROUND ON SCROLL =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.05)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
});

// ===== MOUSE TRAIL EFFECT (Optional Enhancement) =====
function initMouseTrail() {
    const coords = { x: 0, y: 0 };
    const circles = document.querySelectorAll('.circle');

    if (circles.length === 0) return;

    circles.forEach((circle, index) => {
        circle.x = 0;
        circle.y = 0;
    });

    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach((circle, index) => {
            circle.style.left = x - 12 + 'px';
            circle.style.top = y - 12 + 'px';
            circle.style.transform = `scale(${(circles.length - index) / circles.length})`;

            circle.x = x;
            circle.y = y;

            const nextCircle = circles[index + 1] || circles[0];
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();
}

// ===== PROJECT CARD TILT EFFECT =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== UTILITY: Debounce Function =====
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

// ===== PERFORMANCE: Smooth Resize Handler =====
window.addEventListener('resize', debounce(() => {
    // Handle responsive adjustments if needed
    console.log('Window resized');
}, 250));

// ===== LIQUID GLASS NAVIGATION INDICATOR =====
function initLiquidIndicator() {
    const indicator = document.querySelector('.nav-indicator');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    if (!indicator || navLinks.length === 0) return;

    // Position indicator on active link
    function updateIndicator(activeLink) {
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = activeLink.closest('.nav-links').getBoundingClientRect();

        const padding = 10; // Add padding around the text
        const left = linkRect.left - navRect.left - padding;
        const width = linkRect.width + (padding * 2);
        const height = linkRect.height + (padding * 1.5);

        indicator.style.left = `${left}px`;
        indicator.style.width = `${width}px`;
        indicator.style.height = `${height}px`;
        indicator.style.top = `${-padding * 1.20}px`;
    }

    // Set initial position
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        setTimeout(() => updateIndicator(activeLink), 100);
    }

    // Update on click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateIndicator(link);
        });
    });

    // Update based on scroll position
    let ticking = false;

    function updateActiveSection() {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        if (current) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    updateIndicator(link);
                }
            });
        }
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Update on resize
    window.addEventListener('resize', debounce(() => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            updateIndicator(activeLink);
        }
    }, 250));
}

