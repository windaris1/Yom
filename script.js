let matches = [];
let currentChannel = null;
let activeMatchId = null;

async function loadMatches() {
  try {
    const res = await fetch('matches.json');
    matches = await res.json();
    renderMatches(matches);
  } catch (err) {
    document.getElementById('matchList').innerHTML = '<div class="no-live-message">Failed to load matches</div>';
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

  if (data.length === 0) {
    container.innerHTML = '<div class="no-live-message"><h3>No Live Events</h3><p>Check back later</p></div>';
    return;
  }

  container.innerHTML = data.map(match => {
    const isLive = match.status === 'live';
    const isActive = activeMatchId === match.id;

    return `
      <div class="event-container" onclick='toggleMatch("${match.id}")'>
        ${isLive? '<div class="live-label">Live</div>' : ''}
        <h2>
          <img class="sport-icon" src="${match.league_logo}" alt="">
          ${match.league}
        </h2>
        <div class="team">
          <img class="team-logo" src="${getFlagUrl(match.team1.code)}" alt="">
          ${match.team1.name}
        </div>
        <div class="team">
          <img class="team-logo" src="${getFlagUrl(match.team2.code)}" alt="">
          ${match.team2.name}
        </div>
        <div class="kickoff-match-date">${formatDate(match.kickoff_date)}</div>
        <div class="kickoff-match-time">${match.kickoff_time}</div>

        <div class="server-buttons ${isActive?'active':''}" id="server-${match.id}">
          <div class="server-toolbar">
            <div class="instruction">You can select a server stream:</div>
            <button class="server-refresh-button" onclick="refreshStream(event)">↻</button>
          </div>
          <div class="buttons-container" id="grid-${match.id}"></div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleMatch(matchId) {
  const match = matches.find(m => m.id === matchId);
  const serverDiv = document.getElementById(`server-${matchId}`);

  // Close other
  if (activeMatchId && activeMatchId!== matchId) {
    document.getElementById(`server-${activeMatchId}`).classList.remove('active');
  }

  // Toggle
  if (activeMatchId === matchId) {
    serverDiv.classList.remove('active');
    activeMatchId = null;
  } else {
    serverDiv.classList.add('active');
    activeMatchId = matchId;

    // Render servers
    const grid = document.getElementById(`grid-${matchId}`);
    grid.innerHTML = match.channels.map((ch, i) =>
      `<div class="server-button ${i===0?'active':''}" onclick="playChannel(this, '${ch.url}', event)">${ch.name}</div>`
    ).join('');

    if (match.channels.length > 0) {
      playChannel(grid.querySelector('.server-button'), match.channels[0].url, event);
    }
  }
}

function playChannel(btn, url, e) {
  e.stopPropagation();
  currentChannel = url;
  btn.parentElement.querySelectorAll('.server-button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('video-iframe').src = url;
}

function refreshStream(e) {
  e.stopPropagation();
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