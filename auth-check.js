// Authentication Check - Include this on all protected pages
(function() {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('forher_authenticated');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If not authenticated and not on auth page, redirect to login
    if (!isAuthenticated && currentPage !== 'auth.html') {
        window.location.href = 'auth.html';
    }
    
    // Optional: Add session timeout (e.g., 24 hours)
    const loginTime = localStorage.getItem('forher_login_time');
    if (loginTime) {
        const currentTime = new Date().getTime();
        const hoursPassed = (currentTime - loginTime) / (1000 * 60 * 60);
        
        // If more than 24 hours, logout
        if (hoursPassed > 24) {
            logout();
        }
    }
})();

// Logout function
function logout() {
    localStorage.removeItem('forher_authenticated');
    localStorage.removeItem('forher_user');
    localStorage.removeItem('forher_login_time');
    window.location.href = 'auth.html';
}

// Add logout button functionality if it exists
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
