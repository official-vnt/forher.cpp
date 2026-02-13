const myProjects = [
    {
        title: "The Personal Assistant",
        stack: "PYTHON / FLASK",
        desc: "An automated script that organizes her daily coding tasks and sends morning motivation.",
        isDeployed: true,
        source: "#",
        demo: "#"
    },
    {
        title: "Efficient Route Finder",
        stack: "C++ / ALGORITHMS",
        desc: "Optimizing pathfinding using Dijkstra's algorithm for complex grid structures.",
        isDeployed: false,
        source: "#",
        demo: null
    }
];

function renderProjects() {
    const grid = document.getElementById('projectGrid');
    
    myProjects.forEach(proj => {
        const statusText = proj.isDeployed ? "BUILD_SUCCESS" : "STAGING";
        const statusClass = proj.isDeployed ? "deployed" : "developing";
        const demoLink = proj.isDeployed ? `<a href="${proj.demo}" class="live-link">Live Demo</a>` : `<span class="live-link disabled">Prototype</span>`;

        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-preview">
                <span class="status-tag ${statusClass}">${statusText}</span>
            </div>
            <div class="project-details">
                <span class="tech-stack">${proj.stack}</span>
                <h3>${proj.title}</h3>
                <p>${proj.desc}</p>
                <div class="project-links">
                    <a href="${proj.source}" class="view-link">View Source</a>
                    ${demoLink}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.onload = renderProjects;

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.getElementById('navSearch').focus();
    }
});