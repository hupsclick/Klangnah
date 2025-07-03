export class Modal {
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }

  render() {
    return `
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">${this.title}</h2>
            <button class="btn btn-icon modal-close" data-action="close-modal">
              <span class="icon">✕</span>
            </button>
          </div>
          <div class="modal-content">
            ${this.content}
          </div>
        </div>
      </div>
    `;
  }
}