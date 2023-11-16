export default class Modal {
  constructor(element) {
    if (!element) {
      throw new Error("element is not defined");
    }
    this.element = element;
    this.registerEvents();
  }

  registerEvents() {
    const dismissElements = this.element.querySelectorAll(
      '[data-dismiss="modal"]'
    );

    for (let el of dismissElements) {
      el.addEventListener("click", (e) => this.onClose(e));
    }
  }

  onClose(e) {
    e.preventDefault();
    this.close();
  }

  open(title) {
    this.element.style.display = "flex";
    const titleModal = this.element.querySelector(".modal-title");
    titleModal.textContent = title;
  }

  close() {
    this.element.style.removeProperty("display");
  }
}
