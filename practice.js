// 1. Handle Quest Completion
const initQuests = () => {
    const solveButtons = document.querySelectorAll('.solve-btn');
    
    solveButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.quest-card');
            const questTitle = card.querySelector('h3').innerText;
            
            // Visual feedback for the button
            this.innerText = "MASTERED ❤️";
            this.style.background = "#4CAF50"; // Green for success
            this.disabled = true;

            // Trigger the romantic "Heart Burst" we built in the main script
            if (typeof createHeartBurst === "function") {
                createHeartBurst();
            }

            console.log(`Quest Completed: ${questTitle}`);
            alert(`Amazing work! You just earned the XP for: ${questTitle}`);
        });
    });
};

// 2. Integration with your Header Search Bar
const initSearchFilter = () => {
    const searchInput = document.getElementById('navSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.quest-card');

            cards.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                const desc = card.querySelector('p').innerText.toLowerCase();
                
                if (title.includes(term) || desc.includes(term)) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    }
};

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    initQuests();
    initSearchFilter();
});

// Local Storage XP Tracking
let currentXP = parseInt(localStorage.getItem('userXP')) || 0;
const questXP = parseInt(card.querySelector('.xp').innerText.replace('+ ', '').replace(' XP', ''));

currentXP += questXP;
localStorage.setItem('userXP', currentXP);

// You can then display this in your header logo or nav!
// document.querySelector('.logo-highlight').innerText = `LVL ${Math.floor(currentXP/500)}`;

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.getElementById('navSearch').focus();
    }
});