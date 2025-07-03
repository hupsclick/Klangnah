export class Footer {
  render() {
    return `
      <footer class="app-footer">
        <div class="footer-content">
          <div class="footer-links">
            <a href="#impressum" class="footer-link">Impressum</a>
            <span class="footer-separator">|</span>
            <a href="#datenschutz" class="footer-link">Datenschutz</a>
          </div>
          <div class="footer-copyright">
            © 2025 Klangnah. Eine professionelle Hörhilfe-Anwendung.
          </div>
        </div>
      </footer>
    `;
  }
}