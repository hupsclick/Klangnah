import { Header } from './Header.js';
import { MainContent } from './MainContent.js';
import { Footer } from './Footer.js';
import { Modal } from './Modal.js';
import { AudioProcessor } from '../audio/AudioProcessor.js';
import { ProfileManager } from '../utils/ProfileManager.js';

export class App {
  constructor() {
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    this.audioProcessor = new AudioProcessor();
    this.profileManager = new ProfileManager();
    this.showHeadphoneWarning = true;
    this.showInstructions = false;
    this.showVolumeWarning = false;
    this.showImpressum = false;
    this.showDataProtection = false;
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Use event delegation on document to handle dynamically created elements
    document.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('input', this.handleInput.bind(this));
    document.addEventListener('change', this.handleChange.bind(this));
  }

  handleClick(event) {
    const target = event.target;
    
    // Prevent default for anchor links
    if (target.matches('a[href^="#"]')) {
      event.preventDefault();
    }
    
    // Check for data-action attributes on the clicked element or its parents
    const actionElement = target.closest('[data-action]');
    if (actionElement) {
      const action = actionElement.getAttribute('data-action');
      
      switch (action) {
        case 'toggle-dark-mode':
          event.preventDefault();
          this.toggleDarkMode();
          break;
        case 'show-instructions':
          event.preventDefault();
          this.showInstructions = true;
          this.render();
          break;
        case 'close-modal':
          event.preventDefault();
          this.closeModal();
          break;
        case 'start-audio':
          event.preventDefault();
          this.startAudio();
          break;
        case 'stop-audio':
          event.preventDefault();
          this.stopAudio();
          break;
        case 'save-profile':
          event.preventDefault();
          this.saveProfile();
          break;
        case 'load-profile':
          event.preventDefault();
          this.loadProfile(actionElement.dataset.profile);
          break;
        case 'reset-equalizer':
          event.preventDefault();
          this.resetEqualizer();
          break;
      }
      return; // Exit early if we handled a data-action
    }
    
    // Handle footer links
    if (target.matches('a[href="#impressum"]')) {
      event.preventDefault();
      this.showImpressum = true;
      this.render();
    } else if (target.matches('a[href="#datenschutz"]')) {
      event.preventDefault();
      this.showDataProtection = true;
      this.render();
    }
    
    // Handle modal overlay click (close when clicking outside)
    if (target.matches('.modal-overlay')) {
      this.closeModal();
    }
  }

  handleInput(event) {
    const target = event.target;
    
    if (target.matches('[data-control="volume"]')) {
      const volume = parseFloat(target.value);
      this.audioProcessor.setVolume(volume);
      
      // Update volume percentage display in real-time
      const volumeDisplay = document.querySelector('.volume-percentage');
      if (volumeDisplay) {
        volumeDisplay.textContent = `${Math.round(volume * 100)}%`;
      }
      
      // Show warning at 270% (90% of max 300%)
      if (volume > 2.7 && !this.showVolumeWarning) {
        this.showVolumeWarning = true;
        this.render();
      }
    } else if (target.matches('[data-control="equalizer"]')) {
      const frequency = target.dataset.frequency;
      const gain = parseFloat(target.value);
      this.audioProcessor.setEqualizerBand(frequency, gain);
      
      // Update the display value in real-time
      const valueDisplay = target.parentElement.querySelector('.eq-value');
      if (valueDisplay) {
        valueDisplay.textContent = `${gain > 0 ? '+' : ''}${gain}dB`;
      }
    }
  }

  handleChange(event) {
    const target = event.target;
    
    if (target.matches('[data-control="profile-select"]')) {
      this.loadProfile(target.value);
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());
    document.body.classList.toggle('dark-mode', this.darkMode);
    this.render();
  }

  closeModal() {
    this.showHeadphoneWarning = false;
    this.showInstructions = false;
    this.showVolumeWarning = false;
    this.showImpressum = false;
    this.showDataProtection = false;
    this.render();
  }

  resetEqualizer() {
    // Reset all equalizer bands to 0
    const frequencies = [250, 500, 1000, 2000, 4000, 8000];
    frequencies.forEach(freq => {
      this.audioProcessor.setEqualizerBand(freq, 0);
    });
    
    // Re-render to update the UI
    this.render();
  }

  async startAudio() {
    try {
      await this.audioProcessor.start();
      this.showHeadphoneWarning = false;
      this.render();
    } catch (error) {
      console.error('Fehler beim Starten der Audio-Verarbeitung:', error);
      alert('Fehler beim Zugriff auf das Mikrofon. Bitte überprüfen Sie die Berechtigungen.');
    }
  }

  stopAudio() {
    this.audioProcessor.stop();
    this.render();
  }

  saveProfile() {
    const name = prompt('Name für das Profil eingeben:');
    if (name) {
      const settings = this.audioProcessor.getSettings();
      this.profileManager.saveProfile(name, settings);
      this.render();
    }
  }

  loadProfile(profileName) {
    const profile = this.profileManager.loadProfile(profileName);
    if (profile) {
      this.audioProcessor.applySettings(profile);
      this.render();
    }
  }

  render(container) {
    if (container) {
      this.container = container;
    }

    if (!this.container) return;

    document.body.classList.toggle('dark-mode', this.darkMode);

    const header = new Header(this.darkMode);
    const mainContent = new MainContent(
      this.audioProcessor,
      this.profileManager.getProfiles()
    );
    const footer = new Footer();

    this.container.innerHTML = `
      ${header.render()}
      ${mainContent.render()}
      ${footer.render()}
      ${this.renderModals()}
    `;
  }

  renderModals() {
    let modals = '';

    if (this.showHeadphoneWarning) {
      const modal = new Modal(
        'Wichtiger Hinweis',
        `
          <div class="warning-content">
            <div class="warning-icon">⚠️</div>
            <p><strong>Schließen Sie unbedingt Kopfhörer an, bevor Sie Klangnah starten, um Rückkopplungen zu vermeiden!</strong></p>
            <p>Ohne Kopfhörer können laute Rückkopplungen entstehen, die Ihr Gehör schädigen können.</p>
            <button class="btn btn-primary" data-action="start-audio">Verstanden - Starten</button>
          </div>
        `
      );
      modals += modal.render();
    }

    if (this.showInstructions) {
      const modal = new Modal(
        'Anleitung zur Verwendung',
        `
          <div class="instructions-content">
            <div class="safety-warning">
              <h3>Wichtiger Sicherheitshinweis</h3>
              <p>❗ Schließen Sie unbedingt Kopfhörer an Ihr Gerät an, um Rückkopplungen zu vermeiden</p>
            </div>
            
            <div class="instruction-steps">
              <div class="step">
                <h4>1. Kopfhörer anschließen</h4>
                <p>Schließen Sie unbedingt Kopfhörer an Ihr Gerät an, um Rückkopplungen zu vermeiden</p>
              </div>
              
              <div class="step">
                <h4>2. Hörhilfe starten</h4>
                <p>Klicken Sie auf "Hörhilfe starten" und erlauben Sie den Mikrofon-Zugriff</p>
              </div>
              
              <div class="step">
                <h4>3. Lautstärke anpassen</h4>
                <p>Passen Sie die Lautstärke nach Ihren Bedürfnissen an (bis zu 300% möglich)</p>
              </div>
              
              <div class="step">
                <h4>4. Equalizer verwenden</h4>
                <p>Nutzen Sie den Equalizer zur Feinabstimmung der Frequenzen</p>
              </div>
              
              <div class="step">
                <h4>5. Echtzeit-Übertragung</h4>
                <p>Die App überträgt alle Umgebungsgeräusche in Echtzeit zu Ihren Kopfhörern</p>
              </div>
            </div>
            
            <div class="additional-tips">
              <h4>Zusätzliche Tipps:</h4>
              <ul>
                <li>Verwenden Sie die "Speichern"-Funktion, um Ihre Einstellungen zu sichern</li>
                <li>Bei Lautstärken über 270% erscheint eine Sicherheitswarnung</li>
                <li>Der Equalizer hilft bei der Anpassung verschiedener Hörfrequenzen</li>
                <li>Die App ist speziell für Menschen mit chronischen Mittelohrentzündungen optimiert</li>
              </ul>
            </div>
            
            <div class="disclaimer">
              <h4>Haftungsausschluss</h4>
              <p>Diese Anwendung dient als Hörhilfe und ersetzt keine professionelle medizinische Beratung. Bei anhaltenden Hörproblemen konsultieren Sie bitte einen HNO-Arzt.</p>
            </div>
            
            <button class="btn btn-secondary" data-action="close-modal">Schließen</button>
          </div>
        `
      );
      modals += modal.render();
    }

    if (this.showVolumeWarning) {
      const modal = new Modal(
        'Warnung: Sehr hohe Lautstärke',
        `
          <div class="warning-content">
            <div class="warning-icon">⚠️</div>
            <p><strong>Sehr hohe Lautstärke (über 270%) kann Ihr Gehör schädigen. Bitte reduzieren Sie die Lautstärke vorsichtig.</strong></p>
            <p>Auch bei Hörbeeinträchtigung sollten Sie extreme Lautstärken vermeiden.</p>
            <button class="btn btn-primary" data-action="close-modal">Verstanden</button>
          </div>
        `
      );
      modals += modal.render();
    }

    if (this.showImpressum) {
      const modal = new Modal(
        'Impressum',
        `
          <div class="legal-content">
            <h3>Angaben gemäß § 5 TMG</h3>
            <p>
              <strong>Klangnah</strong><br>
              Eine professionelle Hörhilfe-Anwendung<br>
              Entwickelt für Menschen mit Hörbeeinträchtigung
            </p>
            
            <h4>Kontakt</h4>
            <p>
              E-Mail: regiemail@gmx.de<br>
            </p>
            
            <h4>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h4>
            <p>
              Klangnah Entwicklungsteam<br>
			  Manfred Häcker<br>
              Feldstraße 6<br>
              17153 Stavenhagen
            </p>
            
            <h4>Haftungsausschluss</h4>
            <p>
              Diese Anwendung dient als technische Hörhilfe und ersetzt keine professionelle 
              medizinische Beratung oder Behandlung. Bei anhaltenden Hörproblemen konsultieren 
              Sie bitte einen qualifizierten HNO-Arzt oder Audiologen.
            </p>
            
            <p>
              Die Nutzung der App erfolgt auf eigene Verantwortung. Wir übernehmen keine 
              Haftung für eventuelle Hörschäden durch unsachgemäße Verwendung.
            </p>
            
            <button class="btn btn-secondary" data-action="close-modal">Schließen</button>
          </div>
        `
      );
      modals += modal.render();
    }

    if (this.showDataProtection) {
      const modal = new Modal(
        'Datenschutzerklärung',
        `
          <div class="legal-content">
            <h3>Datenschutzerklärung</h3>
            
            <h4>1. Datenerfassung</h4>
            <p>
              Klangnah verarbeitet Audiodaten ausschließlich lokal auf Ihrem Gerät. 
              Es werden keine Audiodaten an externe Server übertragen oder gespeichert.
            </p>
            
            <h4>2. Mikrofon-Zugriff</h4>
            <p>
              Die App benötigt Zugriff auf Ihr Mikrofon, um Umgebungsgeräusche in Echtzeit 
              zu verarbeiten. Diese Daten werden nicht aufgezeichnet oder gespeichert.
            </p>
            
            <h4>3. Lokale Speicherung</h4>
            <p>
              Ihre personalisierten Einstellungen und Klangprofile werden ausschließlich 
              lokal in Ihrem Browser gespeichert (LocalStorage). Diese Daten verlassen 
              niemals Ihr Gerät.
            </p>
            
            <h4>4. Keine Datenübertragung</h4>
            <p>
              Klangnah überträgt keine persönlichen Daten, Audiodaten oder Nutzungsdaten 
              an Dritte oder externe Server.
            </p>
            
            <h4>5. Cookies</h4>
            <p>
              Die App verwendet keine Cookies. Alle Einstellungen werden im lokalen 
              Speicher Ihres Browsers gespeichert.
            </p>
            
            <h4>6. Ihre Rechte</h4>
            <p>
              Sie können Ihre gespeicherten Einstellungen jederzeit löschen, indem Sie 
              den Browser-Cache leeren oder die App-Daten in den Browser-Einstellungen löschen.
            </p>
            
            <p><strong>Stand:</strong> Januar 2025</p>
            
            <button class="btn btn-secondary" data-action="close-modal">Schließen</button>
          </div>
        `
      );
      modals += modal.render();
    }

    return modals;
  }
}