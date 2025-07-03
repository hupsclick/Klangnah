export class AudioControls {
  constructor(audioProcessor) {
    this.audioProcessor = audioProcessor;
  }

  render() {
    const isActive = this.audioProcessor.isActive();
    const volume = this.audioProcessor.getVolume();

    return `
      <section class="audio-controls">
        <div class="control-group">
          <h2>Hörhilfe Steuerung</h2>
          
          <div class="main-controls">
            ${!isActive ? `
              <button class="btn btn-primary btn-large" data-action="start-audio">
                <span class="icon">🎤</span>
                Hörhilfe starten
              </button>
            ` : `
              <button class="btn btn-danger btn-large" data-action="stop-audio">
                <span class="icon">⏹️</span>
                Hörhilfe stoppen
              </button>
            `}
          </div>
          
          <div class="volume-control">
            <label for="volume-slider" class="control-label">
              <span class="icon">🔊</span>
              Lautstärke: <span class="volume-percentage">${Math.round(volume * 100)}%</span>
            </label>
            <input 
              type="range" 
              id="volume-slider"
              class="slider volume-slider" 
              min="0" 
              max="3" 
              step="0.01" 
              value="${volume}"
              data-control="volume"
            >
            <div class="volume-indicators">
              <span>0%</span>
              <span class="volume-warning">270%</span>
              <span>300%</span>
            </div>
          </div>
          
          ${isActive ? `
            <div class="status-indicator active">
              <span class="status-dot"></span>
              Hörhilfe aktiv - Umgebungsgeräusche werden übertragen
            </div>
          ` : `
            <div class="status-indicator inactive">
              <span class="status-dot"></span>
              Hörhilfe inaktiv
            </div>
          `}
        </div>
      </section>
    `;
  }
}