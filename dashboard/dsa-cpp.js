// DSA C++ Progress Tracker JavaScript

// Initialize progress from localStorage
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateAllStats();
    
    // Add event listeners to all checkboxes
    const checkboxes = document.querySelectorAll('.task-check');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            handleCheckboxChange(this);
        });
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('isAuthenticated');
                window.location.href = '../login.html';
            }
        });
    }
});

// Load progress from localStorage
function loadProgress() {
    const savedProgress = localStorage.getItem('dsaCppProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        
        // Restore checkbox states
        const checkboxes = document.querySelectorAll('.task-check');
        checkboxes.forEach((checkbox, index) => {
            if (progress.checkboxes && progress.checkboxes[index]) {
                checkbox.checked = true;
                checkbox.closest('tr').classList.add('row-completed');
            }
        });
    }
}

// Save progress to localStorage
function saveProgress() {
    const checkboxes = document.querySelectorAll('.task-check');
    const checkboxStates = Array.from(checkboxes).map(cb => cb.checked);
    
    const progress = {
        checkboxes: checkboxStates,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('dsaCppProgress', JSON.stringify(progress));
}

// Handle checkbox change
function handleCheckboxChange(checkbox) {
    const row = checkbox.closest('tr');
    
    if (checkbox.checked) {
        row.classList.add('row-completed');
        createConfetti();
    } else {
        row.classList.remove('row-completed');
    }
    
    // Update module progress
    const moduleIndex = checkbox.getAttribute('data-module');
    updateModuleProgress(moduleIndex);
    
    // Update overall stats
    updateAllStats();
    
    // Save progress
    saveProgress();
}

// Update module progress
function updateModuleProgress(moduleIndex) {
    const tbody = document.querySelector(`tbody[data-module="${moduleIndex}"]`);
    const checkboxes = tbody.querySelectorAll('.task-check');
    const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    const percentage = Math.round((completed / total) * 100);
    
    // Update module percentage display
    const percentSpan = document.querySelector(`.module-percent[data-module="${moduleIndex}"]`);
    if (percentSpan) {
        percentSpan.textContent = percentage;
    }
}

// Update all statistics
function updateAllStats() {
    const allCheckboxes = document.querySelectorAll('.task-check');
    const completedCheckboxes = Array.from(allCheckboxes).filter(cb => cb.checked);
    
    const totalTopics = allCheckboxes.length;
    const completedTopics = completedCheckboxes.length;
    const overallProgress = Math.round((completedTopics / totalTopics) * 100);
    
    // Calculate remaining time
    let totalTimeLeft = 0;
    allCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            const row = checkbox.closest('tr');
            const time = parseInt(row.getAttribute('data-time')) || 0;
            totalTimeLeft += time;
        }
    });
    
    const hoursLeft = Math.round(totalTimeLeft / 60 * 10) / 10;
    
    // Update DOM
    document.getElementById('totalTopics').textContent = totalTopics;
    document.getElementById('completedTopics').textContent = completedTopics;
    document.getElementById('overallProgress').textContent = overallProgress;
    document.getElementById('totalTimeLeft').textContent = hoursLeft + 'h';
    
    // Update all module percentages
    const modules = document.querySelectorAll('tbody[data-module]');
    modules.forEach(tbody => {
        const moduleIndex = tbody.getAttribute('data-module');
        updateModuleProgress(moduleIndex);
    });
}

// Toggle module collapse
function toggleModule(header) {
    const moduleSection = header.parentElement;
    moduleSection.classList.toggle('module-collapsed');
}

// Toggle all modules
function toggleAllModules() {
    const modules = document.querySelectorAll('.module-section');
    const firstModule = modules[0];
    const shouldExpand = firstModule.classList.contains('module-collapsed');
    
    modules.forEach(module => {
        if (shouldExpand) {
            module.classList.remove('module-collapsed');
        } else {
            module.classList.add('module-collapsed');
        }
    });
}

// Mark all complete
function markAllComplete() {
    if (confirm('Are you sure you want to mark all topics as complete?')) {
        const checkboxes = document.querySelectorAll('.task-check');
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.checked = true;
                checkbox.closest('tr').classList.add('row-completed');
            }
        });
        
        updateAllStats();
        saveProgress();
        createMassConfetti();
        
        alert('🎉 Congratulations! All DSA topics marked as complete!');
    }
}

// Reset all progress
function resetAllProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        const checkboxes = document.querySelectorAll('.task-check');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('tr').classList.remove('row-completed');
        });
        
        updateAllStats();
        saveProgress();
        
        alert('Progress has been reset.');
    }
}

// Export progress
function exportDSAProgress() {
    const checkboxes = document.querySelectorAll('.task-check');
    const modules = [];
    
    // Group by module
    const moduleSections = document.querySelectorAll('.module-section');
    moduleSections.forEach((section, moduleIndex) => {
        const moduleName = section.querySelector('.module-info h3').textContent;
        const tbody = section.querySelector('tbody');
        const moduleCheckboxes = tbody.querySelectorAll('.task-check');
        
        const topics = [];
        moduleCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const topicName = row.querySelector('.topic-name').textContent;
            const completed = checkbox.checked;
            topics.push({ topic: topicName, completed: completed });
        });
        
        modules.push({
            module: moduleName,
            topics: topics
        });
    });
    
    const exportData = {
        course: 'DSA in C++',
        exportDate: new Date().toISOString(),
        modules: modules
    };
    
    // Create downloadable file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dsa-cpp-progress.json';
    link.click();
    
    alert('Progress exported successfully!');
}

// Create confetti animation
function createConfetti() {
    const colors = ['#FF8FA3', '#FFB3C6', '#FFC9D9', '#FFE0E9'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Create mass confetti for completing everything
function createMassConfetti() {
    const colors = ['#FF8FA3', '#FFB3C6', '#FFC9D9', '#FFE0E9'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = '0s';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// Update heart timer (uptime)
function updateHeartTimer() {
    const timerElement = document.querySelector('.heart-timer');
    if (timerElement) {
        let minutes = parseInt(timerElement.textContent.replace(/,/g, ''));
        setInterval(() => {
            minutes++;
            timerElement.textContent = minutes.toLocaleString();
        }, 60000); // Update every minute
    }
}

updateHeartTimer();
