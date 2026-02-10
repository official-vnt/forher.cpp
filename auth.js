document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    // Set your custom credentials here
    if (user === "sau@0305" && pass === "290323") {
        // Access Granted animation
        const btn = document.querySelector('.auth-btn');
        btn.innerText = "ACCESS_GRANTED";
        btn.style.background = "#4CAF50"; // Green for success
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } else {
        errorMsg.innerText = "Error: UNRECOGNIZED_ENTITY. Try again, love.";
        // Shake animation
        document.querySelector('.auth-container').animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0)' }
        ], { duration: 300 });
    }
});