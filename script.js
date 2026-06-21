let matches = [];
let currentChannel = null;
let activeMatchId = null;

async function loadMatches() {
  try {
    const res = await fetch('matches.json');
    matches = await res.json();
    renderMatches(matches);
  } catch (err) {
    document.getElementById('matchList').innerHTML = '<div style="padding:20px;text-align:center;color:#9ca3af;">Failed to load matches</div>';
  }
}

function renderMatches(data) {
  const container = document.getElementById('matchList');

  if (data.length === 0) {
    container.innerHTML = '<div style="padding:20px;text-align:center;color:#9ca3af;">No matches found</div>';
    return;
  }

  container.innerHTML = data.map(match => {
    const isActive = activeMatchId === match.id;
    return `
    <div class="event-container" onclick='toggleMatch("${match.id}")'>
      <h2>
        <img class="sport-icon" src="${match.league_logo}">
        ${match.league}
      </h2>
      <div class="team">
        <img class="team-logo" src="https://flagcdn.com/w40/${match.team1.code}.png">
        ${match.team1.name}
      </div>
      <div class="team">
        <img class="team-logo" src="https://flagcdn.com/w40/${match.team2.code}.png">
        ${match.team2.name}
      </div>
      <div class="kickoff-match-date">${match.kickoff_date}</div>
      <div class="kickoff-match-time">${match.kickoff_time}</div>

      <div class="server-buttons ${isActive? 'active' : ''}" id="server-${match.id}">
        <div class="server-toolbar">
          <span>Select server:</span>
          <span onclick="refreshStream(event)" style="cursor:pointer">↻</span>
        </div>
        <div class="buttons-container" id="grid-${match.id}"></div>
      </div>
    </div>
  `}).join('');
}

function toggleMatch(matchId) {
  const match = matches.find(m => m.id === matchId);
  const serverDiv = document.getElementById(`server-${matchId}`);

  if (activeMatchId && activeMatchId!== matchId) {
    document.getElementById(`server-${activeMatchId}`).classList.remove('active');
  }

  if (activeMatchId === matchId) {
    serverDiv.classList.remove('active');
    activeMatchId = null;
  } else {
    serverDiv.classList.add('active');
    activeMatchId = matchId;

    const grid = document.getElementById(`grid-${matchId}`);
    grid.innerHTML = match.channels.map((ch, i) =>
      `<div class="server-button ${i===0?'active':''}" onclick="playChannel(this, '${ch.url}', event)">CH ${i+1}</div>`
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

// Arrow scroll tabs
document.querySelector('.category-arrow-btn.left').onclick = () => {
  document.querySelector('.category-scroll-wrapper').scrollBy({left: -200, behavior: 'smooth'});
}
document.querySelector('.category-arrow-btn.right').onclick = () => {
  document.querySelector('.category-scroll-wrapper').scrollBy({left: 200, behavior: 'smooth'});
}

loadMatches();