* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html, body {
    height: 100%;
    overflow: hidden;
    font-family: 'Teko', sans-serif;
    background: #0f172a;
    color: #fff;
}

#main-content {
    display: flex;
    width: 100%;
    height: 100vh;
}

/* Video Container */
.video-container {
    flex: 1;
    background: #000;
    height: 100vh;
    position: relative;
}

.video-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.video-wrapper img,
.video-wrapper iframe,
.video-wrapper #player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Countdown */
.countdown-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(330px, calc(100% - 34px));
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.84), rgba(2, 6, 23, 0.96));
    padding: 12px;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.22);
    backdrop-filter: blur(10px);
    z-index: 5;
}

.countdown-title {
    text-align: center;
    font-size: 12px;
    color: rgba(226, 232, 240, 0.78);
    letter-spacing: 1px;
    margin-bottom: 10px;
}

.countdown-event-info {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.countdown-team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.countdown-logo-box {
    width: 34px;
    height: 34px;
    background: rgba(15, 23, 42, 0.58);
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
}

.countdown-logo-box img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.countdown-team span {
    font-size: 12px;
    font-weight: 600;
    text-align: center;
}

.countdown-vs {
    font-size: 11px;
    font-weight: 700;
    color: #e0f2fe;
}

.countdown-timer {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
}

.time-unit {
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.96));
    border: 1px solid rgba(148, 163, 184, 0.14);
    border-radius: 8px;
    padding: 6px 4px;
    text-align: center;
}

.time-unit strong {
    display: block;
    font-size: 24px;
    font-weight: 700;
}

.time-unit span {
    font-size: 9px;
    color: rgba(148, 163, 184, 0.78);
    letter-spacing: 0.6px;
}

/* Sidebar */
.sidebar {
    flex: 0 0 400px;
    width: 400px;
    height: 100vh;
    background: #0f172a;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #1e293b;
}

/* Menu Top - Tabs */
.menu-wrapper-top {
    padding: 8px;
    background: #0f172a;
}

.category-scroll-container {
    display: flex;
    align-items: center;
    gap: 6px;
}

.category-scroll-wrapper {
    flex: 1;
    overflow-x: auto;
    scrollbar-width: none;
}

.category-scroll-wrapper::-webkit-scrollbar {
    display: none;
}

.category-buttons-container {
    display: flex;
    gap: 6px;
}

.category-freeze,
.category-button {
    flex: 0 0 auto;
    padding: 8px 14px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #fff;
    font-family: 'Teko', sans-serif;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s;
}

.category-freeze:hover,
.category-button:hover {
    background: #273449;
}

.category-freeze.active {
    border-color: #ef4444;
}

.category-freeze .live-indicator {
    color: #ef4444;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

.category-arrow-btn {
    flex: 0 0 32px;
    width: 32px;
    height: 38px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.category-arrow-btn:hover {
    background: #273449;
}

/* Search */
.search-wrapper {
    padding: 8px;
}

.search-container {
    width: 100%;
}

.search-input-wrapper {
    position: relative;
}

.search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    font-size: 14px;
}

.search-input {
    width: 100%;
    padding: 10px 12px 10px 38px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #fff;
    font-family: 'Teko', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
}

.search-input:focus {
    border-color: #3b82f6;
}

.search-input::placeholder {
    color: #64748b;
}

.clear-search-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    font-size: 14px;
}

.clear-search-btn:hover {
    color: #fff;
}

.search-result-count {
    margin-top: 6px;
    font-size: 12px;
    color: #94a3b8;
    padding-left: 4px;
}

/* Sidebar Content */
.sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    display: none;
}

.sidebar-content.active {
    display: block;
}

.sidebar-content::-webkit-scrollbar {
    width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
    background: #0f172a;
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 2px;
}

/* Event Cards */
.event-container {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.event-container:hover {
    background: #273449;
    border-color: #475569;
}

.event-container h2 {
    margin: 0 0 8px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #334155;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
}

.team {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
    font-size: 14px;
}

.team-logo {
    width: 22px;
    height: 22px;
    border-radius: 4px;
}

.kickoff-match-date {
    text-align: right;
    font-size: 12px;
    color: #94a3b8;
}

.kickoff-match-time {
    text-align: right;
    font-size: 14px;
    color: #fff;
    font-weight: 600;
}

/* Server Buttons */
.server-buttons {
    display: none;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #334155;
}

.server-buttons.active {
    display: block;
}

.buttons-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
}

.server-button {
    padding: 8px;
    background: #334155;
    border: 1px solid #475569;
    border-radius: 6px;
    text-align: center;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
}

.server-button:hover {
    background: #475569;
}

.server-button.active {
    background: #3b82f6;
    border-color: #3b82f6;
}

/* Chat Iframe */
.chat-iframe {
    width: 100%;
    height: 100%;
    border: none;
}

/* Menu Bottom */
.menu-wrapper-bottom {
    padding: 8px;
    border-top: 1px solid #1e293b;
    background: #0f172a;
}

.menu-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
}

.menu-button {
    padding: 8px 4px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #fff;
    font-family: 'Teko', sans-serif;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    cursor: pointer;
    transition: all 0.2s;
}

.menu-button:hover {
    background: #273449;
}

.menu-button i {
    font-size: 18px;
}

.multiview-button i { color: #60a5fa; }
.androidtv-button i { color: #4ade80; }
.chat-button i { color: #c084fc; }
.saweria-button i { color: #fbbf24; }

/* Modal Multi View */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-container-modern {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    overflow: hidden;
}

.modal-header-modern {
    padding: 16px;
    border-bottom: 1px solid #334155;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header-modern h3 {
    font-size: 18px;
    font-weight: 600;
}

.modal-close-btn-modern {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 20px;
    cursor: pointer;
}

.modal-close-btn-modern:hover {
    color: #fff;
}

.modal-body-modern {
    padding: 16px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.grid-option-modern {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
}

.grid-option-modern:hover {
    border-color: #3b82f6;
    background: #273449;
}

.grid-preview-modern {
    display: grid;
    gap: 4px;
    margin-bottom: 8px;
}

.grid-preview-2 { grid-template-columns: repeat(2, 1fr); }
.grid-preview-4 { grid-template-columns: repeat(2, 1fr); }
.grid-preview-6 { grid-template-columns: repeat(3, 1fr); }
.grid-preview-8 { grid-template-columns: repeat(4, 1fr); }

.grid-box-modern {
    background: #334155;
    height: 40px;
    border-radius: 4px;
}

.grid-label-modern {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 2px;
}

.grid-subtitle-modern {
    font-size: 12px;
    color: #94a3b8;
}

/* Multi View Frame */
#multi-view-frame {
    width: 100%;
    height: 100%;
    border: none;
    position: absolute;
    top: 0;
    left: 0;
}

/* Mobile Responsive */
@media (max-width: 900px) {
    #main-content {
        flex-direction: column;
        height: auto;
        overflow-y: auto;
    }

    html, body {
        overflow: auto;
    }

    .video-container,
    .sidebar {
        width: 100%;
        height: auto;
        flex: none;
    }

    .video-wrapper {
        padding-bottom: 56.25%;
        height: 0;
    }

    .video-wrapper img,
    .video-wrapper iframe,
    .video-wrapper #player {
        position: absolute;
    }

    .sidebar {
        height: auto;
        border-left: none;
        border-top: 1px solid #1e293b;
    }

    .modal-body-modern {
        grid-template-columns: 1fr;
    }
}