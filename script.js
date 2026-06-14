// ==========================================
// HYBRID FORGE — Dashboard Interactivity
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavigation();
    initWorkoutTabs();
    initMealTabs();
    initChecklist();
    updateCurrentDay();
    animateOnScroll();
});

// ==========================================
// PARTICLE BACKGROUND
// ==========================================
function initParticles() {
    const container = document.getElementById('particles');
    const count = 30;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (15 + Math.random() * 25) + 's';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.width = (1 + Math.random() * 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = 0.2 + Math.random() * 0.3;
        container.appendChild(particle);
    }
}

// ==========================================
// NAVIGATION TABS
// ==========================================
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabs = document.querySelectorAll('.tab-content');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Update nav buttons
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update tab content
            tabs.forEach(tab => tab.classList.remove('active'));
            document.getElementById(`tab-${targetTab}`).classList.add('active');
            
            // Scroll to top of content
            window.scrollTo({ top: 140, behavior: 'smooth' });
        });
    });
}

// ==========================================
// WORKOUT DAY TABS
// ==========================================
function initWorkoutTabs() {
    const dayBtns = document.querySelectorAll('.workout-day-btn');
    const panels = document.querySelectorAll('.workout-panel');
    const warmupCard = document.getElementById('warmupCard');
    
    dayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetDay = btn.dataset.workout;
            
            dayBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(`workout-${targetDay}`).classList.add('active');
            
            // Show/hide warmup card based on day
            if (warmupCard) {
                if (targetDay === 'sunday') {
                    warmupCard.style.display = 'none';
                } else {
                    warmupCard.style.display = 'block';
                }
            }
        });
    });
}

// ==========================================
// MEAL DAY TABS
// ==========================================
function initMealTabs() {
    const dayBtns = document.querySelectorAll('.meal-day-btn');
    const panels = document.querySelectorAll('.meal-panel');
    
    dayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetDay = btn.dataset.meal;
            
            dayBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(`meal-${targetDay}`).classList.add('active');
        });
    });
}

// ==========================================
// DAILY CHECKLIST
// ==========================================
function initChecklist() {
    const checklist = document.getElementById('dailyChecklist');
    if (!checklist) return;
    
    const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
    const fill = document.getElementById('checklistFill');
    const count = document.getElementById('checklistCount');
    const total = checkboxes.length;
    
    // Load saved state
    const savedState = JSON.parse(localStorage.getItem('hybridforge_checklist') || '{}');
    const today = new Date().toDateString();
    
    if (savedState.date === today) {
        Object.keys(savedState.items || {}).forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = savedState.items[id];
        });
    }
    
    function updateProgress() {
        const checked = checklist.querySelectorAll('input:checked').length;
        const percentage = (checked / total) * 100;
        
        fill.style.width = percentage + '%';
        count.textContent = `${checked} / ${total} completed`;
        
        // Change color when all done
        if (checked === total) {
            fill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            count.style.color = '#10b981';
        } else {
            fill.style.background = '';
            count.style.color = '';
        }
        
        // Save state
        const items = {};
        checkboxes.forEach(cb => {
            items[cb.id] = cb.checked;
        });
        localStorage.setItem('hybridforge_checklist', JSON.stringify({
            date: new Date().toDateString(),
            items: items
        }));
    }
    
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateProgress);
    });
    
    updateProgress();
}

// ==========================================
// CURRENT DAY INDICATOR
// ==========================================
function updateCurrentDay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const dayName = days[now.getDay()];
    
    document.getElementById('currentDay').textContent = dayName.substring(0, 3);
    
    // Highlight current day in week grid
    const dayCards = document.querySelectorAll('.day-card');
    dayCards.forEach(card => {
        if (card.dataset.day === dayName.toLowerCase()) {
            card.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3), inset 0 0 0 1px rgba(99, 102, 241, 0.4)';
            card.style.background = 'rgba(99, 102, 241, 0.08)';
        }
    });
    
    // Calculate week based on a start date (today as week 1 for demo)
    const startDate = new Date(localStorage.getItem('hybridforge_start') || now.toISOString());
    if (!localStorage.getItem('hybridforge_start')) {
        localStorage.setItem('hybridforge_start', now.toISOString());
    }
    
    const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.min(12, Math.max(1, Math.floor(diffDays / 7) + 1));
    
    document.getElementById('currentWeek').textContent = currentWeek;
    
    // Update phase
    let phase = 'Foundation';
    if (currentWeek >= 9) phase = 'Peak';
    else if (currentWeek >= 5) phase = 'Building';
    
    document.getElementById('currentPhase').textContent = phase;
    
    // Highlight active phase
    const phases = document.querySelectorAll('.phase-block');
    phases.forEach(p => p.classList.remove('active'));
    if (currentWeek <= 4) document.getElementById('phase1')?.classList.add('active');
    else if (currentWeek <= 8) document.getElementById('phase2')?.classList.add('active');
    else document.getElementById('phase3')?.classList.add('active');
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.glass-card, .exercise-card, .meal-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}
