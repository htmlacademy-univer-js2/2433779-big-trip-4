import { createPointEditTemplate } from '../templates/point-edit-template.js';
import { DEFAULT_POINT } from '../consts.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class EditFormView extends AbstractStatefulView{
  #offers = null;
  #destinations = null;
  #onEditFormReset = null;
  #onEditFormSubmit = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point = DEFAULT_POINT, offers = [], destinations, onEditFormReset, onEditFormSubmit}) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onEditFormReset = onEditFormReset;
    this.#onEditFormSubmit = onEditFormSubmit;

    this._setState(EditFormView.parsePointToState({point}));
    this._restoreHandlers();
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  reset = (point) => this.updateElement({ point });

  _restoreHandlers = () => {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#submitClickHandler);

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#resetClickHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.element
      .querySelector('.event__available-offers')
      .addEventListener('change', this.#offerChangeHandler);
    this.#setDatepickerFromHandler();
    this.#setDatepickerToHandler();
  };

  get template() {
    return createPointEditTemplate(this._state.point, this.#offers, this.#destinations);
  }

  #tripPointDateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #tripPointDateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepickerFromHandler = () => {
    if (this._state.point.dateFrom) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          maxDate: this._state.dateTo,
          onChange: this.#tripPointDateFromChangeHandler,
        },
      );
    }
  };

  #setDatepickerToHandler = () => {
    if (this._state.point.dateTo) {
      this.#datepickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onChange: this.#tripPointDateToChangeHandler,
        },
      );
    }
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditFormReset();
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditFormSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: [],
      },
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.value,
      }
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((destination) => destination.name === evt.target.value).id;
    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestination,
      }
    });
  };

  #offerChangeHandler = () => {
    const selectedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map(({id}) => id.split('-').slice(3).join('-'));

    this._setState({
      point: {
        ...this._state.point,
        offers: selectedOffers
      }
    });
  };

  static parsePointToState = ({ point }) => ({ point });
  static parseStateToPoint = (state) => state.point;
}
