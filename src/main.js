import { App } from './components/App.js';

// Initialize the app
const appContainer = document.getElementById('app');
const app = new App();
app.render(appContainer);