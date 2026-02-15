// Enhanced Prerequisites Manager
// Handles progress tracking, stats, and celebrations

const STORAGE_KEY = 'prereq_progress_v2';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeProgressTracking();
    updateStats();
    calculateDailyUptime();
    updateGreeting();
    setupEasterEgg();
    
    // Update stats every second for smooth animations
    setInterval(updateStats, 100);
});

// Progress Tracking System
function initializeProgressTracking() {
    const checkboxes = document.querySelectorAll('.task-check');
    const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    
    checkboxes.forEach((checkbox, index) => {
        // Restore saved state
        if (savedProgress[index]) {
            checkbox.checked = true;
            checkbox.closest('tr').classList.add('row-completed');
        }
        
        // Add change listener
        checkbox.addEventListener('change', (e) => {
            handleCheckboxChange(e, index);
        });
    });
}

function handleCheckboxChange(event, index) {
    const checkbox = event.target;
    const row = checkbox.closest('tr');
    const isChecked = checkbox.checked;
    
    // Update visual state
    if (isChecked) {
        row.classList.add('row-completed');
        celebrateTask();
    } else {
        row.classList.remove('row-completed');
    }
    
    // Save to localStorage
    const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    savedProgress[index] = isChecked;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProgress));
    
    // Update stats
    updateStats();
    
    // Check for completion
    checkAllComplete();
    
    console.log(`[SYSTEM] Task ${index + 1} marked as ${isChecked ? 'COMPLETE' : 'INCOMPLETE'}`);
}

// Stats Calculation
function updateStats() {
    const checkboxes = document.querySelectorAll('.task-check');
    const total = checkboxes.length;
    const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calculate time left
    const rows = document.querySelectorAll('#prereqTableBody tr');
    let timeLeft = 0;
    rows.forEach((row, index) => {
        const checkbox = row.querySelector('.task-check');
        if (!checkbox.checked) {
            const time = parseInt(row.dataset.time) || 0;
            timeLeft += time;
        }
    });
    
    // Update UI
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('progressPercent').textContent = percentage;
    
    // Format time left
    const hours = Math.floor(timeLeft / 60);
    const mins = timeLeft % 60;
    let timeText = '';
    if (hours > 0) timeText += `${hours}h `;
    if (mins > 0 || hours === 0) timeText += `${mins}m`;
    document.getElementById('timeLeft').textContent = timeText || '0m';
}

// Celebration Effects
function celebrateTask() {
    // Create confetti
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createConfetti(), i * 50);
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = window.innerHeight + 'px';
    confetti.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3000);
}

function checkAllComplete() {
    const checkboxes = document.querySelectorAll('.task-check');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    if (allChecked) {
        setTimeout(() => {
            showCompletionMessage();
        }, 500);
    }
}

function showCompletionMessage() {
    // Create celebration modal
    const message = `
        🎉 ENVIRONMENT SETUP COMPLETE! 🎉
        
        All prerequisites are done!
        You're ready to start your coding journey.
        
        I'm so proud of you! ❤️
    `;
    
    alert(message);
    
    // Extra celebration
    for (let i = 0; i < 50; i++) {
        setTimeout(() => createConfetti(), i * 30);
    }
}

// Action Buttons
function checkAll() {
    const checkboxes = document.querySelectorAll('.task-check');
    checkboxes.forEach((checkbox, index) => {
        if (!checkbox.checked) {
            checkbox.checked = true;
            checkbox.closest('tr').classList.add('row-completed');
            
            const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            savedProgress[index] = true;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProgress));
        }
    });
    updateStats();
    showCompletionMessage();
}

function uncheckAll() {
    if (confirm('Are you sure you want to reset all progress?')) {
        const checkboxes = document.querySelectorAll('.task-check');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('tr').classList.remove('row-completed');
        });
        localStorage.removeItem(STORAGE_KEY);
        updateStats();
        console.log('[SYSTEM] Progress reset');
    }
}

function exportProgress() {
    const checkboxes = document.querySelectorAll('.task-check');
    const rows = document.querySelectorAll('#prereqTableBody tr');
    
    let report = '=== PREREQUISITES PROGRESS REPORT ===\n\n';
    report += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    rows.forEach((row, index) => {
        const checkbox = checkboxes[index];
        const status = checkbox.checked ? '✓' : '☐';
        const topic = row.querySelector('.topic-name').textContent;
        report += `${status} ${index + 1}. ${topic}\n`;
    });
    
    const stats = document.getElementById('completedTasks').textContent;
    const total = document.getElementById('totalTasks').textContent;
    const percent = document.getElementById('progressPercent').textContent;
    
    report += `\n=== STATISTICS ===\n`;
    report += `Completed: ${stats}/${total} (${percent}%)\n`;
    report += `Time Remaining: ${document.getElementById('timeLeft').textContent}\n`;
    
    // Download as text file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prerequisites-progress.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('[SYSTEM] Progress exported');
}

// Dynamic Greeting
function updateGreeting() {
    const hour = new Date().getHours();
    const subtitle = document.querySelector('.hero .subtitle');
    
    let message = "";
    if (hour < 12) {
        message = "Morning vibes! ☕ Coffee's ready, and so is your potential. Let's crush these setup tasks!";
    } else if (hour < 18) {
        message = "Afternoon energy! 🚀 You're doing amazing. Each task completed brings you closer to coding mastery!";
    } else {
        message = "Evening focus! 🌙 Almost there! Rest your eyes when needed—you've grown so much today!";
    }
    
    if (subtitle) {
        subtitle.textContent = message;
    }
}

// Daily Uptime Calculator
function calculateDailyUptime() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const diffMs = now - startOfDay;
    const diffMins = Math.floor(diffMs / 60000);
    
    const timerElements = document.querySelectorAll('.heart-timer');
    timerElements.forEach(el => {
        el.textContent = diffMins.toLocaleString();
    });
}

// Update uptime every 30 seconds
setInterval(calculateDailyUptime, 30000);

// Easter Egg - Type 'love'
function setupEasterEgg() {
    let inputBuffer = "";
    
    window.addEventListener('keydown', (e) => {
        inputBuffer += e.key.toLowerCase();
        
        if (inputBuffer.includes("love")) {
            triggerLoveEasterEgg();
            inputBuffer = "";
        }
        
        if (inputBuffer.length > 10) {
            inputBuffer = "";
        }
    });
}

function triggerLoveEasterEgg() {
    const banner = document.querySelector('h1');
    banner.style.color = "#ff8fa3";
    banner.style.textShadow = "0 0 20px rgba(255, 143, 163, 0.8)";
    
    // Create hearts
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = window.innerHeight + 'px';
            heart.style.fontSize = '2rem';
            heart.style.pointerEvents = 'none';
            heart.style.animation = 'confetti 3s ease-out forwards';
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 3000);
        }, i * 100);
    }
    
    setTimeout(() => {
        alert("❤️ Root Access Granted: I love you more than clean code! 💕");
    }, 500);
    
    setTimeout(() => {
        banner.style.color = "";
        banner.style.textShadow = "";
    }, 3000);
}

// Keyboard shortcut for search
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('navSearch');
        if (searchInput) searchInput.focus();
    }
});

// Console greeting
console.log(`
╔═══════════════════════════════════════╗
║   FORHER.CPP - PREREQUISITES MODULE   ║
║   Version 1.2.0 - Enhanced Edition    ║
╚═══════════════════════════════════════╝

💡 Pro Tips:
- Type 'love' anywhere to trigger easter egg
- Use Ctrl+K to focus search
- All progress is auto-saved

Made with ❤️ for the best dev
`);