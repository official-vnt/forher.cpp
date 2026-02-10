let currentFilter = 'all';
const masterData = JSON.parse(localStorage.getItem('sharedLogs')) || [];

function renderFeed() {
    const feed = document.getElementById('masterFeed');
    feed.innerHTML = '';
    
    const filtered = currentFilter === 'all' ? masterData : masterData.filter(d => d.type === currentFilter);

    filtered.sort((a,b) => new Date(a.date) - new Date(b.date)).forEach(item => {
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.innerHTML = `
            <div class="entry-content">
                <span class="owner-badge ${item.owner}">${item.owner}</span>
                <span style="font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #666; margin-left: 10px;">${item.date}</span>
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
            </div>
            <div class="entry-actions">
                <button onclick="deleteLog(${item.id})" style="background:none; border:none; color:#ff4d4d; cursor:pointer;">&times; REMOVE</button>
            </div>
        `;
        feed.appendChild(div);
    });
}

function filterFeed(type) {
    currentFilter = type;
    document.querySelectorAll('.feed-tab').forEach(t => t.classList.toggle('active', t.innerText.toLowerCase().includes(type)));
    renderFeed();
}

function deleteLog(id) {
    const index = masterData.findIndex(item => item.id === id);
    masterData.splice(index, 1);
    localStorage.setItem('sharedLogs', JSON.stringify(masterData));
    renderFeed();
}

document.getElementById('openModal').onclick = () => document.getElementById('logModal').style.display = 'flex';
function closeModal() { document.getElementById('logModal').style.display = 'none'; }

document.getElementById('commitBtn').onclick = () => {
    const newItem = {
        id: Date.now(),
        type: document.getElementById('logType').value,
        owner: document.getElementById('ownerType').value,
        title: document.getElementById('logTitle').value,
        desc: document.getElementById('logDesc').value,
        date: document.getElementById('logDate').value
    };
    masterData.push(newItem);
    localStorage.setItem('sharedLogs', JSON.stringify(masterData));
    renderFeed();
    closeModal();
};

window.onload = renderFeed;

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.getElementById('navSearch').focus();
    }
});