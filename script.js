let matches = [];
let countdownInterval;
let hls;
let currentMatch;

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
      <div class="match-card" onclick='playStream(${JSON.stringify(match)}, "${firstUrl}")'>
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

function playStream(match, url) {
  if (!url) {
    alert('No stream available');
    return;
  }
  
  currentMatch = match;
  const wrapper = document.getElementById('playerWrapper');
  const video = document.getElementById('videoPlayer');
  const title = document.getElementById('playerTitle');
  
  wrapper.style.display = 'block';
  title.textContent = `${match.team1.name} vs ${match.team2.name}`;
  
  const grid = document.getElementById('serverGrid');
  grid.innerHTML = match.channels.map((ch, i) => 
    `<button class="server-btn ${i===0?'active':''}" onclick="switchServer(this, '${ch.url}')">${ch.name}</button>`
  ).join('');
  
  loadVideo(url);
  wrapper.scrollIntoView({ behavior: 'smooth' });
}

function loadVideo(url) {
  const video = document.getElementById('videoPlayer');
  
  if (hls) {
    hls.destroy();
  }
  
  if (Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(e => console.log('Autoplay blocked'));
    });
    hls.on(Hls.Events.ERROR, (e, data) => {
      if (data.fatal) {
        console.error('HLS error:', data);
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.play().catch(e => console.log('Autoplay blocked'));
  } else {
    alert('Your browser does not support HLS streams');
  }
}

function switchServer(btn, url) {
  document.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadVideo(url);
}

function closePlayer() {
  document.getElementById('playerWrapper').style.display = 'none';
  if (hls) hls.destroy();
  document.getElementById('videoPlayer').pause();
}

function toggleMute() {
  const video = document.getElementById('videoPlayer');
  const btn = document.getElementById('muteBtn');
  video.muted = !video.muted;
  btn.textContent = video.muted ? '🔇' : '🔊';
}

function showCountdown(matchId) {
  const match = matches.find(m => m.id === matchId);
  if (!match) return;
  
  const matchTime = getMatchDateTime(match);
  if (matchTime < new Date()) return;
  
  const modal = document.getElementById('countdownModal');
  const teamsDiv = document.getElementById('countdownTeams');
  
  teamsDiv.innerHTML = `
    <div class="countdown-team">
      <img src="${getFlagUrl(match.team1.code)}" alt="">
      <div>${match.team1.name}</div>
    </div>
    <div class="countdown-vs">VS</div>
    <div class="countdown-team">
      <img src="${getFlagUrl(match.team2.code)}" alt="">
      <div>${match.team2.name}</div>
    </div>
  `;
  
  modal.classList.add('active');
  updateCountdown(matchTime);
  
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => updateCountdown(matchTime), 1000);
}

function updateCountdown(targetTime) {
  const now = new Date();
  const diff = targetTime - now;
  
  if (diff <= 0) {
    closeCountdown();
    renderMatches(matches);
    return;
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  document.getElementById('countdownTimer').innerHTML = `
    <div class="timer-block">
      <div class="timer-value">${String(days).padStart(2, '0')}</div>
      <div class="timer-label">DAYS</div>
    </div>
    <div class="timer-block">
      <div class="timer-value">${String(hours).padStart(2, '0')}</div>
      <div class="timer-label">HOURS</div>
    </div>
    <div class="timer-block">
      <div class="timer-value">${String(minutes).padStart(2, '0')}</div>
      <div class="timer-label">MINUTES</div>
    </div>
    <div class="timer-block">
      <div class="timer-value">${String(seconds).padStart(2, '0')}</div>
      <div class="timer-label">SECONDS</div>
    </div>
  `;
}

function closeCountdown() {
  document.getElementById('countdownModal').classList.remove('active');
  clearInterval(countdownInterval);
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