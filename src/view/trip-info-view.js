import { createTripInfoTemplate } from '../templates/trip-info-template.js';
import { createElement } from '../render.js';

export default class TripInfoView {
  constructor({points}) {
    this.points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this.points);
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
