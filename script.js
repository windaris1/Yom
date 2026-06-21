let matches = [];
let currentChannel = null;

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

  if (data.length === 0) {
    container.innerHTML = '<div class="no-result">No matches found</div>';
    return;
  }

  container.innerHTML = data.map(match => {
    const isLive = match.status === 'live';
    const badge = isLive? '<span class="live-badge">Live</span>' : '';

    return `
      <div class="match-card" onclick='openMatch(${JSON.stringify(match)})'>
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
    `;
  }).join('');
}

function openMatch(match) {
  const wrapper = document.getElementById('serverWrapper');
  const grid = document.getElementById('serverGrid');

  wrapper.style.display = 'block';

  grid.innerHTML = match.channels.map((ch, i) =>
    `<button class="server-btn ${i===0?'active':''}" onclick="playChannel(this, '${ch.url}')">${ch.name}</button>`
  ).join('');

  if (match.channels.length > 0) {
    playChannel(grid.querySelector('.server-btn'), match.channels[0].url);
  }

  wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function playChannel(btn, url) {
  currentChannel = url;
  document.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('video-iframe').src = url;
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