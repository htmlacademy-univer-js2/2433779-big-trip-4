import { createPointEditTemplate } from '../templates/point-edit-template.js';
import { createElement } from '../render.js';

export default class PointEditView {
  getTemplate() {
    return createPointEditTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
