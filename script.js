// 1. Progress Bar Animation
const animateProgress = () => {
    const progressBar = document.querySelector('.progress-bar-fill');
    // You can update this value as she learns more!
    const currentProgress = "72%"; 
    
    setTimeout(() => {
        progressBar.style.width = currentProgress;
    }, 500);
};

// 2. Dynamic Personal Greeting
const updateGreeting = () => {
    const hour = new Date().getHours();
    const subtext = document.querySelector('.hero .subtitle');
    
    let message = "";
    if (hour < 12) message = "Coffee's ready, and so is your potential. Let's crush some bugs this morning.";
    else if (hour < 18) message = "You're doing amazing. Take a deep breath—even the best code needs a break.";
    else message = "Rest your eyes soon. You've grown so much today, and I'm proud of you.";
    
    // We append your original romantic note to the dynamic greeting
    subtext.innerText = `${message} You're my favorite person to debug life with.`;
};

// 3. The "Easter Egg" - Type 'love' to activate
let inputBuffer = "";
const easterEgg = (e) => {
    inputBuffer += e.key.toLowerCase();
    if (inputBuffer.includes("love")) {
        createHeartBurst();
        inputBuffer = ""; // Reset
    }
    if (inputBuffer.length > 10) inputBuffer = ""; // Keep buffer small
};

const createHeartBurst = () => {
    const banner = document.querySelector('h1');
    banner.style.color = "#ff8fa3";
    banner.style.textShadow = "0 0 20px rgba(255, 143, 163, 0.8)";
    
    alert("❤️ Root Access Granted: I love you more than clean code!");
    
    setTimeout(() => {
        banner.style.color = "";
        banner.style.textShadow = "";
    }, 3000);
};

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    animateProgress();
    updateGreeting();
    window.addEventListener('keydown', easterEgg);
});

// const animateProgress = () => {
//     const progressBar = document.querySelector('.progress-bar-fill');
//     const currentProgress = "72%"; 
    
//     // Wait 3.5 seconds (the length of the typing animation) 
//     // before the bar starts filling up.
//     setTimeout(() => {
//         progressBar.style.width = currentProgress;
//         progressBar.style.transition = "width 2s ease-in-out";
//     }, 3500); 
// };

function calculateDailyUptime() {
    const now = new Date();
    
    // Create a date object for 12:00 AM of the current day
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    
    // Calculate difference in milliseconds
    const diffMs = now - startOfDay;
    
    // Convert milliseconds to total minutes
    const diffMins = Math.floor(diffMs / 60000);
    
    const timerElement = document.querySelector('.heart-timer');
    if(timerElement) {
        // Use toLocaleString to keep the professional comma formatting (e.g., 1,240)
        timerElement.innerText = diffMins.toLocaleString();
    }
}

// Run immediately on load
calculateDailyUptime();

// Update every 30 seconds to keep it precise
setInterval(calculateDailyUptime, 30000);