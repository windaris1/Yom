let matches = [];

async function loadMatches() {
  try {
    const res = await fetch('matches.json');
    matches = await res.json();
    renderMatches(matches);
  } catch (err) {
    console.error('Failed to load matches:', err);
    document.getElementById('matchList').innerHTML = '<div class="no-result">Failed to load matches</div>';
  }
}

function getFlagUrl(code) {
  return code ? `https://flagcdn.com/w40/${code}.png` : '';
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getMatchDateTime(match) {
  return new Date(`${match.kickoff_date}T${match.kickoff_time}:00Z`);
}

function renderMatches(data) {
  const container = document.getElementById('matchList');
  
  if (data.length === 0) {
    container.innerHTML = '<div class="no-result">No matches found</div>';
    return;
  }
  
  container.innerHTML = data.map(match => {
    const matchTime = getMatchDateTime(match);
    const isLive = match.status === 'live' || matchTime < new Date();
    const badge = isLive ? '<span class="live-badge">Live</span>' : '';
    const firstUrl = match.channels && match.channels.length > 0 ? match.channels[0].url : '';
    
    return `
      <div class="match-card" onclick='playStream("${firstUrl}")'>
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

function playStream(url) {
  if (!url) {
    alert('No stream available');
    return;
  }
  
  document.getElementById('video-placeholder').style.display = 'none';
  document.getElementById('countdown').style.display = 'none';
  document.getElementById('video-iframe').style.display = 'block';
  document.getElementById('video-iframe').src = url;
  
  document.querySelector('.video-container').scrollIntoView({ behavior: 'smooth' });
}

function closePlayer() {
  document.getElementById('video-iframe').style.display = 'none';
  document.getElementById('video-iframe').src = 'about:blank';
  document.getElementById('video-placeholder').style.display = 'block';
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

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

loadMatches();