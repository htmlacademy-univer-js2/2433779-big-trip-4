import { createPointTemplate } from '../templates/point-template.js';
import AbstractView from '../framework/view/abstract-view';

export default class PointView extends AbstractView{
  #point;
  #offersByPointType;
  #destination;
  #onEditClick;

  constructor({point, offersByPointType, destination, onEditClick}) {
    super();
    this.#point = point;
    this.#offersByPointType = offersByPointType;
    this.#destination = destination;
    this.#onEditClick = onEditClick;

    this.#addPointHandlers();
  }

  get template() {
    return createPointTemplate(this.#point, this.#offersByPointType, this.#destination);
  }

  #addPointHandlers = () => {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };
}
