import { createTripListTemplate } from '../templates/trip-list-template.js';
import { createElement } from '../render.js';

export default class EventListView {
  getTemplate() {
    return createTripListTemplate();
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
