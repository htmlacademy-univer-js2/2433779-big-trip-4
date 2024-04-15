import { createPointEditTemplate } from '../templates/point-edit-template.js';
import { createElement } from '../render.js';
import { DEFAULT_POINT } from '../consts.js';

export default class PointEditView {
  constructor({point = DEFAULT_POINT, offersByPointType = []}) {
    this.point = point;
    this.offersByPointType = offersByPointType;
  }

  getTemplate() {
    return createPointEditTemplate(this.point, this.offersByPointType);
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
