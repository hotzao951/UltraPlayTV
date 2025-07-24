// Particles Animation
class ParticlesAnimation {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.01;
                particle.vy -= (dy / distance) * force * 0.01;
            }
            
            // Boundary collision
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            this.ctx.fill();
            
            // Connect nearby particles
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 80)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1, rootMargin: '50px' }
        );
        
        this.init();
    }
    
    init() {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.observer.observe(el);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }
}

// Counter Animation
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current).toLocaleString('pt-BR');
        }, 16);
    }
}

// Tilt Effect
class TiltEffect {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('[data-tilt]').forEach(element => {
            element.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            element.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        });
    }
    
    handleMouseMove(e) {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }
    
    handleMouseLeave(e) {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
}

// FAQ Accordion
class FAQAccordion {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', (e) => this.toggleFAQ(e));
        });
    }
    
    toggleFAQ(e) {
        const faqItem = e.target.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    }
}

// Plans Toggle
class PlansToggle {
    constructor() {
        this.baseMonthlyPrice = {
            basic: 35,
            premium: 35,
            family: 40
        };
        this.init();
    }
    
    init() {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleToggle(e));
        });
    }
    
    handleToggle(e) {
        const button = e.target;
        const period = button.dataset.period;
        
        // Update active state
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Hide all prices and periods
        const periods = ['monthly', 'bimonthly', 'quarterly', 'semiannual', 'annual'];
        periods.forEach(p => {
            document.querySelectorAll(`.${p}-price`).forEach(price => {
                price.style.display = 'none';
            });
            document.querySelectorAll(`.${p}-period`).forEach(periodEl => {
                periodEl.style.display = 'none';
            });
        });
        
        // Show selected prices and periods
        document.querySelectorAll(`.${period}-price`).forEach(price => {
            price.style.display = 'inline';
        });
        document.querySelectorAll(`.${period}-period`).forEach(periodEl => {
            periodEl.style.display = 'inline';
        });
        
        // Update price comparison
        this.updatePriceComparison(period);
    }
    
    updatePriceComparison(period) {
        const priceMultipliers = {
            monthly: { months: 1, basic: 35, premium: 35, family: 40 },
            bimonthly: { months: 2, basic: 60, premium: 60, family: 70 },
            quarterly: { months: 3, basic: 80, premium: 85, family: 100 },
            semiannual: { months: 6, basic: 150, premium: 140, family: 160 },
            annual: { months: 12, basic: 275, premium: 250, family: 280 }
        };
        
        const currentPlan = priceMultipliers[period];
        
        // Update each plan card
        document.querySelectorAll('.plan-card').forEach((card, index) => {
            const planTypes = ['basic', 'premium', 'family'];
            const planType = planTypes[index];
            
            if (!planType) return;
            
            const currentPrice = currentPlan[planType];
            const monthlyEquivalent = currentPrice / currentPlan.months;
            const baseMonthly = this.baseMonthlyPrice[planType];
            const discount = period === 'monthly' ? 0 : Math.round((1 - monthlyEquivalent / baseMonthly) * 100);
            
            // Find or create price comparison element
            let priceComparison = card.querySelector('.price-comparison');
            if (!priceComparison) {
                priceComparison = document.createElement('div');
                priceComparison.className = 'price-comparison';
                card.querySelector('.plan-header').appendChild(priceComparison);
            }
            
            if (period === 'monthly') {
                priceComparison.innerHTML = '';
            } else {
                priceComparison.innerHTML = `
                    <div class="comparison-item">
                        <span class="monthly-equivalent">R$ ${monthlyEquivalent.toFixed(2)}/mês</span>
                        <span class="vs">vs</span>
                        <span class="original-price">R$ ${baseMonthly}/mês</span>
                    </div>
                    <div class="discount-badge-large">
                        ${discount}% OFF
                    </div>
                `;
            }
        });
    }
}

// Modal System
class ModalSystem {
    constructor() {
        this.modal = document.getElementById('demoModal');
        this.init();
    }
    
    init() {
        // Close modal events
        document.querySelector('.close-modal').addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }
    
    openModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Smooth Header
class SmoothHeader {
    constructor() {
        this.header = document.querySelector('header');
        this.lastScrollTop = 0;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            this.header.style.background = 'rgba(10, 10, 10, 0.95)';
            this.header.style.backdropFilter = 'blur(20px)';
        } else {
            this.header.style.background = 'rgba(10, 10, 10, 0.8)';
        }
        
        this.lastScrollTop = scrollTop;
    }
}

// Mobile Menu
class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.isOpen = false;
        this.init();
    }
    
    init() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }
    }
    
    toggleMenu() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.navLinks.style.display = 'flex';
            this.navLinks.style.flexDirection = 'column';
            this.navLinks.style.position = 'absolute';
            this.navLinks.style.top = '100%';
            this.navLinks.style.left = '0';
            this.navLinks.style.width = '100%';
            this.navLinks.style.background = 'rgba(10, 10, 10, 0.95)';
            this.navLinks.style.backdropFilter = 'blur(20px)';
            this.navLinks.style.padding = '2rem';
            this.navLinks.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            this.navLinks.style.display = 'none';
        }
    }
}

// Global Functions
function openDemoModal() {
    window.modalSystem.openModal();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Initialize all components
    new ParticlesAnimation();
    new ScrollAnimations();
    new CounterAnimation();
    new TiltEffect();
    new FAQAccordion();
    new PlansToggle();
    window.modalSystem = new ModalSystem();
    new SmoothHeader();
    new MobileMenu();
    
    // Initialize testimonials stats counter
    setTimeout(() => {
        new CounterAnimation();
    }, 500);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add hover effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Loading animation complete
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 100);
});

// Performance optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload critical resources
        const criticalImages = ['logo.png'];
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    });
}

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker for offline functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}