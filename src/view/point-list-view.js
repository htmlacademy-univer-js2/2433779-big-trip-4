import { createTripListTemplate } from '../templates/trip-list-template.js';
import AbstractView from '../framework/view/abstract-view.js';
import { createEmptyPointListTemplate } from '../templates/empty-point-list-template.js';


export default class PointListView extends AbstractView{
  #points;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    if (this.#points.length > 0){
      return createTripListTemplate();
    }
    else{
      return createEmptyPointListTemplate();
    }
  }
}
