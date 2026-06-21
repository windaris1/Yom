let matches = [];
let currentChannel = null;
let activeMatchId = null;

async function loadMatches() {
  try {
    const res = await fetch('matches.json');
    matches = await res.json();
    renderMatches(matches);
  } catch (err) {
    document.getElementById('matchList').innerHTML = '<div class="no-result">Failed to load matches</div>';
  }
}

function getFlagUrl(code) {
  return code? `https://flagcdn.com/w40/${code}.png` : '';
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function renderMatches(data) {
  const container = document.getElementById('matchList');

  container.innerHTML = data.map(match => {
    const isLive = match.status === 'live';
    const badge = isLive? '<span class="live-badge">Live</span>' : '';
    const isActive = activeMatchId === match.id;

    return `
      <div class="match-item">
        <div class="match-card" onclick='toggleMatch("${match.id}")'>
          ${badge}
          <div class="league">
            <img src="${match.league_logo}" alt=""> ${match.league}
          </div>
          <div class="team">
            <img src="${getFlagUrl(match.team1.code)}" alt=""> ${match.team1.name}
          </div>
          <div class="team">
            <img src="${getFlagUrl(match.team2.code)}" alt=""> ${match.team2.name}
          </div>
          <div class="match-time">${formatDate(match.kickoff_date)}<br>${match.kickoff_time}</div>
        </div>
        <div class="server-wrapper ${isActive?'active':''}" id="server-${match.id}">
          <div class="server-header">
            <span>You can select a server stream:</span>
            <span onclick="refreshStream()">↻</span>
          </div>
          <div class="server-grid" id="grid-${match.id}"></div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleMatch(matchId) {
  const match = matches.find(m => m.id === matchId);
  const serverDiv = document.getElementById(`server-${matchId}`);

  // Close other open servers
  if (activeMatchId && activeMatchId!== matchId) {
    document.getElementById(`server-${activeMatchId}`).classList.remove('active');
  }

  // Toggle current
  if (activeMatchId === matchId) {
    serverDiv.classList.remove('active');
    activeMatchId = null;
  } else {
    serverDiv.classList.add('active');
    activeMatchId = matchId;

    // Render servers
    const grid = document.getElementById(`grid-${matchId}`);
    grid.innerHTML = match.channels.map((ch, i) =>
      `<button class="server-btn ${i===0?'active':''}" onclick="playChannel(this, '${ch.url}', event)">${ch.name}</button>`
    ).join('');

    // Auto play first
    if (match.channels.length > 0) {
      playChannel(grid.querySelector('.server-btn'), match.channels[0].url, event);
    }
  }
}

function playChannel(btn, url, e) {
  e.stopPropagation();
  currentChannel = url;

  // Update active button
  btn.parentElement.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('video-iframe').src = url;
  document.querySelector('.video-container').scrollIntoView({ behavior: 'smooth' });
}

function refreshStream() {
  if (currentChannel) {
    document.getElementById('video-iframe').src = currentChannel;
  }
}

document.getElementById('search').addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  const filtered = matches.filter(m =>
    m.league.toLowerCase().includes(query) ||
    m.team1.name.toLowerCase().includes(query) ||
    m.team2.name.toLowerCase().includes(query)
  );
  renderMatches(filtered);
});

loadMatches();