import { createPointTemplate } from '../templates/point-template.js';
import { createElement } from '../render.js';

export default class PointView {
  constructor({point, offersByPointType}) {
    this.point = point;
    this.offersByPointType = offersByPointType;
  }

  getTemplate() {
    return createPointTemplate(this.point, this.offersByPointType);
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
