import { createPointTemplate } from '../templates/point-template.js';
import AbstractView from '../framework/view/abstract-view';
export default class PointView extends AbstractView{
  #point;
  #offers;
  #destination;
  #onPointEditFormClick;
  #onFavoriteClick;

  constructor({point, offers, destination, onPointEditFormClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;
    this.#onPointEditFormClick = onPointEditFormClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.#addPointHandlers();
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destination);
  }

  #addPointHandlers = () => {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element
      .querySelector('.event__favorite-icon')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#onPointEditFormClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };
}
