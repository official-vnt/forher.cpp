const blogData = [
    {
        tag: "CORE_UPDATE",
        date: "FEB 10, 2026",
        title: "Python 3.14 Alpha: What to Expect",
        preview: "The internal architecture is getting a massive overhaul. Here's how it affects your current projects.",
        link: "#"
    },
    {
        tag: "SECURITY",
        date: "FEB 08, 2026",
        title: "Memory Safety in C++ 26",
        preview: "New standards are making C++ as safe as Rust without losing the performance edge.",
        link: "#"
    },
    {
        tag: "LOGIC",
        date: "FEB 05, 2026",
        title: "Why DSA Still Matters in the Age of AI",
        preview: "Even with LLMs, understanding Big O notation is the difference between a coder and an architect.",
        link: "#"
    }
];

function loadBlogs() {
    const feed = document.getElementById('blogFeed');
    
    blogData.forEach(post => {
        const article = document.createElement('article');
        article.className = 'blog-card';
        article.innerHTML = `
            <div class="blog-meta">
                <span class="tag">${post.tag}</span>
                <span class="date">${post.date}</span>
            </div>
            <h2>${post.title}</h2>
            <p>${post.preview}</p>
            <a href="${post.link}" class="read-more">Read Documentation -></a>
        `;
        feed.appendChild(article);
    });
}

window.onload = loadBlogs;

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.getElementById('navSearch').focus();
    }
});