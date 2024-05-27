import { createTripListTemplate } from '../templates/trip-list-template.js';
import AbstractView from '../framework/view/abstract-view.js';

export default class PointListView extends AbstractView{
  #points;
  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createTripListTemplate();
  }
}
