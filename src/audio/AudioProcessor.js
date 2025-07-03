export class AudioProcessor {
  constructor() {
    this.audioContext = null;
    this.microphone = null;
    this.gainNode = null;
    this.filters = {};
    this.isRunning = false;
    this.volume = 1.5; // Erhöht von 0.5 auf 1.5 (150%) für Menschen mit Hörbeeinträchtigung
    this.equalizerSettings = {
      250: 0,
      500: 0,
      1000: 0,
      2000: 0,
      4000: 0,
      8000: 0
    };
  }

  async start() {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });

      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create microphone source
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.volume;
      
      // Create equalizer filters
      this.createEqualizerFilters();
      
      // Connect audio nodes
      let currentNode = this.microphone;
      
      // Connect through equalizer filters
      Object.values(this.filters).forEach(filter => {
        currentNode.connect(filter);
        currentNode = filter;
      });
      
      // Connect to gain and output
      currentNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      
      this.isRunning = true;
      
    } catch (error) {
      console.error('Error starting audio processor:', error);
      throw error;
    }
  }

  stop() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.microphone = null;
    this.gainNode = null;
    this.filters = {};
    this.isRunning = false;
  }

  createEqualizerFilters() {
    const frequencies = [250, 500, 1000, 2000, 4000, 8000];
    
    frequencies.forEach((freq, index) => {
      const filter = this.audioContext.createBiquadFilter();
      
      if (index === 0) {
        filter.type = 'lowshelf';
      } else if (index === frequencies.length - 1) {
        filter.type = 'highshelf';
      } else {
        filter.type = 'peaking';
        filter.Q.value = 1;
      }
      
      filter.frequency.value = freq;
      filter.gain.value = this.equalizerSettings[freq];
      
      this.filters[freq] = filter;
    });
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(3, volume)); // Maximum auf 3.0 (300%) erhöht
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  getVolume() {
    return this.volume;
  }

  setEqualizerBand(frequency, gain) {
    const freq = parseInt(frequency);
    const gainValue = Math.max(-20, Math.min(20, gain));
    
    this.equalizerSettings[freq] = gainValue;
    
    if (this.filters[freq]) {
      this.filters[freq].gain.value = gainValue;
    }
  }

  getEqualizerSettings() {
    return { ...this.equalizerSettings };
  }

  isActive() {
    return this.isRunning;
  }

  getSettings() {
    return {
      volume: this.volume,
      equalizer: { ...this.equalizerSettings }
    };
  }

  applySettings(settings) {
    if (settings.volume !== undefined) {
      this.setVolume(settings.volume);
    }
    
    if (settings.equalizer) {
      Object.entries(settings.equalizer).forEach(([freq, gain]) => {
        this.setEqualizerBand(freq, gain);
      });
    }
  }
}