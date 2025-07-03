import { AudioControls } from './AudioControls.js';
import { Equalizer } from './Equalizer.js';
import { ProfileManager as ProfileManagerComponent } from './ProfileManagerComponent.js';

export class MainContent {
  constructor(audioProcessor, profiles) {
    this.audioProcessor = audioProcessor;
    this.profiles = profiles;
  }

  render() {
    const audioControls = new AudioControls(this.audioProcessor);
    const equalizer = new Equalizer(this.audioProcessor);
    const profileManager = new ProfileManagerComponent(this.profiles);

    return `
      <main class="main-content">
        <div class="container">
          ${audioControls.render()}
          ${equalizer.render()}
          ${profileManager.render()}
        </div>
      </main>
    `;
  }
}