export class Equalizer {
  constructor(audioProcessor) {
    this.audioProcessor = audioProcessor;
    this.frequencies = [250, 500, 1000, 2000, 4000, 8000];
  }

  render() {
    const settings = this.audioProcessor.getEqualizerSettings();

    return `
      <section class="equalizer">
        <div class="control-group">
          <h2>Frequenz-Equalizer</h2>
          <p class="equalizer-description">
            Passen Sie die verschiedenen Frequenzbereiche an Ihre Hörbedürfnisse an
          </p>
          
          <div class="equalizer-controls">
            ${this.frequencies.map(freq => {
              const gain = settings[freq] || 0;
              return `
                <div class="eq-band">
                  <label class="eq-label">${freq}Hz</label>
                  <input 
                    type="range" 
                    class="slider eq-slider vertical" 
                    min="-20" 
                    max="20" 
                    step="0.5" 
                    value="${gain}"
                    data-control="equalizer"
                    data-frequency="${freq}"
                    orient="vertical"
                  >
                  <span class="eq-value">${gain > 0 ? '+' : ''}${gain}dB</span>
                </div>
              `;
            }).join('')}
          </div>
          
          <div class="eq-presets">
            <button class="btn btn-secondary btn-small" data-action="reset-equalizer">
              Zurücksetzen
            </button>
          </div>
        </div>
      </section>
    `;
  }
}