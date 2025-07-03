export class ProfileManager {
  constructor() {
    this.profiles = this.loadProfiles();
    this.initializePresets();
  }

  initializePresets() {
    // Preset for conversations - boost mid frequencies, höhere Lautstärke für Hörbeeinträchtigte
    if (!this.profiles['conversation']) {
      this.profiles['conversation'] = {
        volume: 2.1, // 210% - erhöht für Menschen mit Hörbeeinträchtigung
        equalizer: {
          250: -2,
          500: 2,
          1000: 4,
          2000: 6,
          4000: 3,
          8000: -1
        }
      };
    }

    // Preset for TV/Media - balanced with slight bass reduction, moderate Lautstärke
    if (!this.profiles['tv']) {
      this.profiles['tv'] = {
        volume: 1.8, // 180% - angepasst für TV/Medien
        equalizer: {
          250: -3,
          500: 0,
          1000: 2,
          2000: 3,
          4000: 2,
          8000: 1
        }
      };
    }

    // Preset for street/traffic - reduce low frequencies, boost highs, höchste Lautstärke
    if (!this.profiles['street']) {
      this.profiles['street'] = {
        volume: 2.4, // 240% - höchste Lautstärke für Verkehrslärm
        equalizer: {
          250: -5,
          500: -3,
          1000: 0,
          2000: 3,
          4000: 5,
          8000: 4
        }
      };
    }

    this.saveProfiles();
  }

  saveProfile(name, settings) {
    this.profiles[name] = { ...settings };
    this.saveProfiles();
  }

  loadProfile(name) {
    return this.profiles[name] ? { ...this.profiles[name] } : null;
  }

  getProfiles() {
    return { ...this.profiles };
  }

  deleteProfile(name) {
    if (this.profiles[name] && !['conversation', 'tv', 'street'].includes(name)) {
      delete this.profiles[name];
      this.saveProfiles();
      return true;
    }
    return false;
  }

  loadProfiles() {
    try {
      const saved = localStorage.getItem('klangnah-profiles');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading profiles:', error);
      return {};
    }
  }

  saveProfiles() {
    try {
      localStorage.setItem('klangnah-profiles', JSON.stringify(this.profiles));
    } catch (error) {
      console.error('Error saving profiles:', error);
    }
  }
}