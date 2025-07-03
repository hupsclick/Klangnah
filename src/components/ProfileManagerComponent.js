export class ProfileManager {
  constructor(profiles) {
    this.profiles = profiles;
  }

  render() {
    const profileNames = Object.keys(this.profiles);

    return `
      <section class="profile-manager">
        <div class="control-group">
          <h2>Klangprofile</h2>
          <p class="profile-description">
            Speichern und laden Sie Ihre personalisierten Einstellungen für verschiedene Situationen
          </p>
          
          <div class="profile-controls">
            <div class="profile-select-group">
              <label for="profile-select" class="control-label">
                <span class="icon">📁</span>
                Gespeicherte Profile:
              </label>
              <select id="profile-select" class="profile-select" data-control="profile-select">
                <option value="">Profil auswählen...</option>
                ${profileNames.map(name => {
                  const profile = this.profiles[name];
                  const volumePercent = profile && profile.volume ? Math.round(profile.volume * 100) : 0;
                  return `
                    <option value="${name}">${name} (${volumePercent}%)</option>
                  `;
                }).join('')}
              </select>
            </div>
            
            <div class="profile-actions">
              <button class="btn btn-secondary" data-action="save-profile">
                <span class="icon">💾</span>
                Aktuelles Profil speichern
              </button>
            </div>
          </div>
          
          <div class="preset-profiles">
            <h3>Vordefinierte Profile:</h3>
            <div class="preset-buttons">
              <button class="btn btn-outline" data-action="load-profile" data-profile="conversation">
                <span class="icon">💬</span>
                Gespräch
                <span class="profile-volume">(${this.profiles['conversation'] ? Math.round(this.profiles['conversation'].volume * 100) : 210}%)</span>
              </button>
              <button class="btn btn-outline" data-action="load-profile" data-profile="tv">
                <span class="icon">📺</span>
                TV/Medien
                <span class="profile-volume">(${this.profiles['tv'] ? Math.round(this.profiles['tv'].volume * 100) : 180}%)</span>
              </button>
              <button class="btn btn-outline" data-action="load-profile" data-profile="street">
                <span class="icon">🚗</span>
                Straße/Verkehr
                <span class="profile-volume">(${this.profiles['street'] ? Math.round(this.profiles['street'].volume * 100) : 240}%)</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}