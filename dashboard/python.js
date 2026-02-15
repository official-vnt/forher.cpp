// Enhanced Python Learning Tracker
// Handles progress tracking, stats, module collapsing, and celebrations

const STORAGE_KEY = 'python_progress_v1';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializePythonTracking();
    updateAllStats();
    calculateDailyUptime();
    updateGreeting();
    setupEasterEgg();
    
    // Update stats periodically
    setInterval(updateAllStats, 100);
    setInterval(calculateDailyUptime, 30000);
});

// Progress Tracking System
function initializePythonTracking() {
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
    updateAllStats();
    
    // Check for module completion
    const moduleNum = checkbox.dataset.module;
    updateModuleProgress(moduleNum);
    
    // Check for overall completion
    checkAllComplete();
    
    console.log(`[PYTHON] Topic ${index + 1} marked as ${isChecked ? 'COMPLETE' : 'INCOMPLETE'}`);
}

// Stats Calculation
function updateAllStats() {
    const checkboxes = document.querySelectorAll('.task-check');
    const total = checkboxes.length;
    const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calculate time left
    const rows = document.querySelectorAll('tbody tr');
    let timeLeft = 0;
    rows.forEach(row => {
        const checkbox = row.querySelector('.task-check');
        if (!checkbox.checked) {
            const time = parseInt(row.dataset.time) || 0;
            timeLeft += time;
        }
    });
    
    // Update UI
    document.getElementById('totalTopics').textContent = total;
    document.getElementById('completedTopics').textContent = completed;
    document.getElementById('overallProgress').textContent = percentage;
    
    // Format time left
    const hours = Math.floor(timeLeft / 60);
    const mins = timeLeft % 60;
    let timeText = '';
    if (hours > 0) timeText += `${hours}h `;
    if (mins > 0 || hours === 0) timeText += `${mins}m`;
    document.getElementById('totalTimeLeft').textContent = timeText || '0m';
}

// Module Progress Tracking
function updateModuleProgress(moduleNum) {
    const moduleCheckboxes = document.querySelectorAll(`.task-check[data-module="${moduleNum}"]`);
    const total = moduleCheckboxes.length;
    const completed = Array.from(moduleCheckboxes).filter(cb => cb.checked).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const percentElement = document.querySelector(`.module-percent[data-module="${moduleNum}"]`);
    if (percentElement) {
        percentElement.textContent = percentage;
    }
}

// Module Collapse/Expand
function toggleModule(headerElement) {
    const moduleSection = headerElement.closest('.module-section');
    moduleSection.classList.toggle('module-collapsed');
}

function toggleAllModules() {
    const modules = document.querySelectorAll('.module-section');
    const firstModule = modules[0];
    const shouldCollapse = !firstModule.classList.contains('module-collapsed');
    
    modules.forEach(module => {
        if (shouldCollapse) {
            module.classList.add('module-collapsed');
        } else {
            module.classList.remove('module-collapsed');
        }
    });
}

// Celebration Effects
function celebrateTask() {
    // Create confetti
    for (let i = 0; i < 10; i++) {
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
    const message = `
🎉 PYTHON MASTERY ACHIEVED! 🐍

You've completed all 40 topics!
You're now a Python wizard! ✨

I'm so incredibly proud of you! ❤️

Next stop: Building amazing projects!
    `;
    
    alert(message);
    
    // Mega celebration
    for (let i = 0; i < 100; i++) {
        setTimeout(() => createConfetti(), i * 20);
    }
}

// Action Buttons
function markAllComplete() {
    if (confirm('Mark all Python topics as complete? This will update all modules.')) {
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
        
        // Update all module progress
        for (let i = 0; i < 5; i++) {
            updateModuleProgress(i);
        }
        
        updateAllStats();
        showCompletionMessage();
    }
}

function resetAllProgress() {
    if (confirm('Are you sure you want to reset ALL Python progress? This cannot be undone.')) {
        const checkboxes = document.querySelectorAll('.task-check');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('tr').classList.remove('row-completed');
        });
        
        localStorage.removeItem(STORAGE_KEY);
        
        // Update all module progress
        for (let i = 0; i < 5; i++) {
            updateModuleProgress(i);
        }
        
        updateAllStats();
        console.log('[PYTHON] All progress reset');
    }
}

function exportPythonProgress() {
    const modules = [
        'Python Basics & Syntax',
        'Data Structures',
        'Functions & Modules',
        'OOP & File Handling',
        'Advanced Python'
    ];
    
    let report = '=== PYTHON MASTERY PROGRESS REPORT ===\n\n';
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `Learning Path: Python Fundamentals\n\n`;
    
    // Module-by-module breakdown
    for (let moduleNum = 0; moduleNum < 5; moduleNum++) {
        report += `\n--- MODULE ${moduleNum + 1}: ${modules[moduleNum]} ---\n`;
        
        const moduleCheckboxes = document.querySelectorAll(`.task-check[data-module="${moduleNum}"]`);
        const moduleRows = document.querySelectorAll(`tbody[data-module="${moduleNum}"] tr`);
        
        moduleRows.forEach((row, index) => {
            const checkbox = moduleCheckboxes[index];
            const status = checkbox.checked ? '✓' : '☐';
            const topic = row.querySelector('.topic-name').textContent;
            report += `${status} ${topic}\n`;
        });
        
        const total = moduleCheckboxes.length;
        const completed = Array.from(moduleCheckboxes).filter(cb => cb.checked).length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        report += `Module Progress: ${completed}/${total} (${percent}%)\n`;
    }
    
    // Overall statistics
    const totalTopics = document.getElementById('totalTopics').textContent;
    const completedTopics = document.getElementById('completedTopics').textContent;
    const overallProgress = document.getElementById('overallProgress').textContent;
    const timeLeft = document.getElementById('totalTimeLeft').textContent;
    
    report += `\n\n=== OVERALL STATISTICS ===\n`;
    report += `Total Topics: ${totalTopics}\n`;
    report += `Completed: ${completedTopics}\n`;
    report += `Progress: ${overallProgress}%\n`;
    report += `Est. Time Remaining: ${timeLeft}\n`;
    report += `\n--- End of Report ---\n`;
    report += `Keep coding with passion! 💕🐍`;
    
    // Download as text file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `python-progress-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('[PYTHON] Progress exported');
}

// Dynamic Greeting
function updateGreeting() {
    const hour = new Date().getHours();
    const subtitle = document.querySelector('.hero .subtitle');
    
    let message = "";
    if (hour < 12) {
        message = "Morning code session! ☕ Python is elegant, and so is your dedication. Let's build something beautiful!";
    } else if (hour < 18) {
        message = "Afternoon progress! 🚀 You're mastering Python one topic at a time. Keep that momentum going!";
    } else {
        message = "Evening learning! 🌙 Python by moonlight. Your commitment to growth inspires me every day!";
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

// Easter Egg - Type 'python'
function setupEasterEgg() {
    let inputBuffer = "";
    
    window.addEventListener('keydown', (e) => {
        inputBuffer += e.key.toLowerCase();
        
        if (inputBuffer.includes("python")) {
            triggerPythonEasterEgg();
            inputBuffer = "";
        }
        
        if (inputBuffer.length > 15) {
            inputBuffer = "";
        }
    });
}

function triggerPythonEasterEgg() {
    const banner = document.querySelector('h1');
    const originalColor = banner.style.color;
    const originalShadow = banner.style.textShadow;
    
    banner.style.color = "#ff8fa3";
    banner.style.textShadow = "0 0 20px rgba(255, 143, 163, 0.8)";
    
    // Create Python emoji cascade
    const emojis = ['🐍', '💕', '✨', '🎉', '💖'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.position = 'fixed';
            emoji.style.left = Math.random() * window.innerWidth + 'px';
            emoji.style.top = window.innerHeight + 'px';
            emoji.style.fontSize = '2rem';
            emoji.style.pointerEvents = 'none';
            emoji.style.animation = 'confetti 3s ease-out forwards';
            document.body.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 3000);
        }, i * 100);
    }
    
    setTimeout(() => {
        alert("🐍 import love\n\nYou're not just learning Python...\nYou're becoming a coding artist! 💕\n\nI'm so proud of you!");
    }, 500);
    
    setTimeout(() => {
        banner.style.color = originalColor;
        banner.style.textShadow = originalShadow;
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

// Initialize module progress on load
window.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < 5; i++) {
        updateModuleProgress(i);
    }
});

// Console greeting
console.log(`
╔═══════════════════════════════════════╗
║    PYTHON MASTERY TRACKER v1.0.0      ║
║    40 Topics • 5 Modules • 20 Hours   ║
╚═══════════════════════════════════════╝

🐍 Welcome to your Python learning journey!

💡 Features:
- Type 'python' anywhere for easter egg
- Use Ctrl+K to focus search
- Click module headers to collapse/expand
- All progress auto-saved

✨ Tips:
- Complete topics in order for best results
- Click resource links for official docs
- Export your progress anytime
- Celebrate every small win!

Made with ❤️ for the best Python dev
`);