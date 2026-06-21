let matches = [];
let currentChannel = null;
let activeMatchId = null;
let countdownInterval = null;
let isMultiView = false;

const contentDiv = document.getElementById('content');
const categoryButtonsDiv = document.getElementById('category-buttons');
const searchInput = document.getElementById('event-search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const searchResultCount = document.getElementById('search-result-count');

// Load matches on start
document.addEventListener('DOMContentLoaded', loadMatches);

async function loadMatches() {
  try {
    const res = await fetch('matches.json');
    if (!res.ok) throw new Error('Failed to fetch matches.json');
    
    matches = await res.json();
    
    renderCategories();
    renderMatches(matches);
    
    // Show countdown for first upcoming match
    const upcoming = matches.find(m => m.status === 'upcoming');
    if (upcoming) showCountdown(upcoming);
    
  } catch (err) {
    console.error('Error loading matches:', err);
    if (contentDiv) {
      contentDiv.innerHTML = '<div style="padding:20px;text-align:center;color:#94a3b8;">Failed to load matches</div>';
    }
  }
}

// Render category buttons
function renderCategories() {
  if (!categoryButtonsDiv) return;
  
  const categories = ['All', ...new Set(matches.map(m => m.category || 'Other'))];
  categoryButtonsDiv.innerHTML = categories.map(cat => `
    <button class="category-button ${cat === 'All' ? 'active' : ''}" onclick="filterCategory('${cat}', this)">
      ${cat.charAt(0).toUpperCase() + cat.slice(1)}
    </button>
  `).join('');
}

// Filter by category
function filterCategory(cat, btn) {
  document.querySelectorAll('.category-button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  if (cat === 'All') {
    renderMatches(matches);
  } else {
    const filtered = matches.filter(m => (m.category || 'Other').toLowerCase() === cat.toLowerCase());
    renderMatches(filtered);
  }
}

// Render match cards
function renderMatches(data) {
  if (!contentDiv) return;
  
  if (data.length === 0) {
    contentDiv.innerHTML = '<div style="padding:20px;text-align:center;color:#94a3b8;">No matches found</div>';
    updateSearchCount(0);
    return;
  }

  updateSearchCount(data.length);

  contentDiv.innerHTML = data.map(match => `
    <div class="event-container" onclick='toggleMatch("${match.id}")'>
      <h2>
        <img src="${match.league_logo || 'https://cdn-icons-png.flaticon.com/512/1380/1380338.png'}" width="18" height="18" alt="">
        ${match.league}
      </h2>
      <div class="team">
        <img class="team-logo" src="https://flagcdn.com/w40/${match.team1.code}.png" alt="${match.team1.name}">
        ${match.team1.name}
      </div>
      <div class="team">
        <img class="team-logo" src="https://flagcdn.com/w40/${match.team2.code}.png" alt="${match.team2.name}">
        ${match.team2.name}
      </div>
      <div class="kickoff-match-date">${match.kickoff_date}</div>
      <div class="kickoff-match-time">${match.kickoff_time}</div>

      <div class="server-buttons ${activeMatchId === match.id ? 'active' : ''}" id="server-${match.id}">
        <div class="buttons-container" id="grid-${match.id}"></div>
      </div>
    </div>
  `).join('');
}

// Toggle match server list
function toggleMatch(matchId) {
  const match = matches.find(m => m.id === matchId);
  if (!match) return;
  
  const serverDiv = document.getElementById(`server-${matchId}`);
  if (!serverDiv) return;

  if (activeMatchId && activeMatchId !== matchId) {
    const oldDiv = document.getElementById(`server-${activeMatchId}`);
    if (oldDiv) oldDiv.classList.remove('active');
  }

  if (activeMatchId === matchId) {
    serverDiv.classList.remove('active');
    activeMatchId = null;
  } else {
    serverDiv.classList.add('active');
    activeMatchId = matchId;

    const grid = document.getElementById(`grid-${matchId}`);
    if (grid) {
      grid.innerHTML = match.channels.map((ch, i) =>
        `<div class="server-button ${i === 0 ? 'active' : ''}" onclick="playChannel(this, '${ch.url}', event)">CH ${i + 1}</div>`
      ).join('');

      if (match.channels.length > 0) {
        playChannel(grid.querySelector('.server-button'), match.channels[0].url, event);
      }
    }
  }
}

// Play channel in iframe
function playChannel(btn, url, e) {
  if (e) e.stopPropagation();
  currentChannel = url;
  
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.server-button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  
  const iframe = document.getElementById('video-iframe');
  const placeholder = document.getElementById('video-placeholder');
  
  if (iframe) {
    iframe.src = url;
    iframe.style.display = 'block';
  }
  if (placeholder) {
    placeholder.style.display = 'none';
  }
  
  // Hide countdown when playing
  const countdown = document.getElementById('countdown');
  if (countdown) countdown.style.display = 'none';
}

// Countdown timer
function showCountdown(match) {
  const cd = document.getElementById('countdown');
  if (!cd) return;
  
  cd.style.display = 'block';
  
  const matchTime = new Date(`${match.kickoff_date} ${match.kickoff_time}`).getTime();
  
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = matchTime - now;
    
    if (distance < 0) {
      clearInterval(countdownInterval);
      cd.style.display = 'none';
      return;
    }
    
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const mins = Math.floor((distance % 3600000) / 60000);
    const secs = Math.floor((distance % 60000) / 1000);
    
    const timerDiv = cd.querySelector('.countdown-timer');
    if (timerDiv) {
      timerDiv.innerHTML = `
        <div class="time-unit"><strong>${String(days).padStart(2, '0')}</strong><span>DAYS</span></div>
        <div class="time-unit"><strong>${String(hours).padStart(2, '0')}</strong><span>HOURS</span></div>
        <div class="time-unit"><strong>${String(mins).padStart(2, '0')}</strong><span>MINUTES</span></div>
        <div class="time-unit"><strong>${String(secs).padStart(2, '0')}</strong><span>SECONDS</span></div>
      `;
    }
    
    // Update team info
    const team1Logo = document.getElementById('cd-team1-logo');
    const team1Name = document.getElementById('cd-team1-name');
    const team2Logo = document.getElementById('cd-team2-logo');
    const team2Name = document.getElementById('cd-team2-name');
    
    if (team1Logo) team1Logo.src = `https://flagcdn.com/w40/${match.team1.code}.png`;
    if (team1Name) team1Name.textContent = match.team1.name;
    if (team2Logo) team2Logo.src = `https://flagcdn.com/w40/${match.team2.code}.png`;
    if (team2Name) team2Name.textContent = match.team2.name;
    
  }, 1000);
}

// Search functionality
if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    if (clearSearchBtn) {
      clearSearchBtn.style.display = query ? 'block' : 'none';
    }
    
    const filtered = matches.filter(m =>
      m.league.toLowerCase().includes(query) ||
      m.team1.name.toLowerCase().includes(query) ||
      m.team2.name.toLowerCase().includes(query)
    );
    renderMatches(filtered);
  });
}

if (clearSearchBtn) {
  clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    renderMatches(matches);
    updateSearchCount(matches.length);
  });
}

function updateSearchCount(count) {
  if (searchResultCount) {
    searchResultCount.textContent = `${count} result${count !== 1 ? 's' : ''} found`;
    searchResultCount.style.display = count < matches.length ? 'block' : 'none';
  }
}

// Scroll categories left/right
function scrollCategories(direction) {
  const wrapper = document.querySelector('.category-scroll-wrapper');
  if (!wrapper) return;
  
  const scrollAmount = direction === 'left' ? -200 : 200;
  wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// Show Live Event tab
function showLiveEvent(show) {
  document.querySelectorAll('.sidebar-content').forEach(el => el.classList.remove('active'));
  const liveEvent = document.getElementById('live-event');
  if (liveEvent) liveEvent.classList.add('active');
}

// Switch sidebar content - Android TV, Chat, etc
function switchContent(contentId) {
  document.querySelectorAll('.sidebar-content').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(contentId);
  if (target) target.classList.add('active');
}

// Multi View functionality
function toggleMultiView() {
  const modal = document.getElementById('grid-selection-modal');
  if (modal) modal.style.display = 'flex';
}

function closeGridModal() {
  const modal = document.getElementById('grid-selection-modal');
  if (modal) modal.style.display = 'none';
}

function selectGrid(count) {
  closeGridModal();
  isMultiView = true;
  
  const multiFrame = document.getElementById('multi-view-frame');
  const singleView = document.getElementById('single-view');
  
  if (singleView) singleView.style.display = 'none';
  if (multiFrame) {
    multiFrame.style.display = 'block';
    
    let cols = count <= 2 ? 2 : count <= 6 ? 3 : 4;
    let gridHTML = `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:4px;width:100%;height:100%;background:#000;">`;
    
    for (let i = 0; i < count; i++) {
      gridHTML += `<iframe src="about:blank" style="width:100%;height:100%;border:none;"></iframe>`;
    }
    gridHTML += '</div>';
    
    multiFrame.srcdoc = gridHTML;
  }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
  const modal = document.getElementById('grid-selection-modal');
  if (modal && e.target === modal) {
    closeGridModal();
  }
});