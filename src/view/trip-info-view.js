import { createTripInfoTemplate } from '../templates/trip-info-template.js';
import AbstractView from '../framework/view/abstract-view';

export default class TripInfoView extends AbstractView{
  #points;
  #destinationModel;

  constructor(points, destinationModel) {
    super();
    this.#points = points;
    this.#destinationModel = destinationModel;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinationModel);
  }
}
