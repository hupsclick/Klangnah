export class Header {
  constructor(darkMode) {
    this.darkMode = darkMode;
  }

  render() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const dateString = now.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    return `
      <header class="app-header">
        <div class="header-left">
          <div class="datetime">
            <div class="time">${timeString}</div>
            <div class="date">${dateString}</div>
          </div>
        </div>
        
        <div class="header-center">
          <h1 class="app-title">
            <span class="logo">🎧</span>
            Klangnah
          </h1>
          <p class="app-subtitle">Mehr hören, mehr leben</p>
        </div>
        
        <div class="header-right">
          <button class="btn btn-icon" data-action="show-instructions" title="Anleitung">
            <span class="icon">📖</span>
          </button>
          <button class="btn btn-icon" data-action="toggle-dark-mode" title="Dark Mode">
            <span class="icon">${this.darkMode ? '☀️' : '🌙'}</span>
          </button>
        </div>
      </header>
    `;
  }
}