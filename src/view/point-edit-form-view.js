import { DEFAULT_POINT, EditType } from '../consts.js';
import { createPointEditFormTemplate } from '../templates/point-edit-form-template.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
export default class PointEditFormView extends AbstractStatefulView{
  #offers = null;
  #destinations = null;
  #handleEditFormReset = null;
  #handleEditFormSubmit = null;
  #handleEditFormDelete = null;
  #editFormType = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  constructor({point = DEFAULT_POINT, offers, destinations, onPointEditFormReset, onPointEditFormSubmit, onPointEditFormDelete, pointEditType = EditType.EDITING}) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleEditFormReset = onPointEditFormReset;
    this.#handleEditFormSubmit = onPointEditFormSubmit;
    this.#handleEditFormDelete = onPointEditFormDelete;
    this.#editFormType = pointEditType;
    const networkState = {
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
    this._setState({point, networkState});
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
    if (this.#editFormType === EditType.EDITING) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#resetClickHandler);
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#deleteClickHandler);
    }
    if (this.#editFormType === EditType.CREATING) {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#resetClickHandler);
    }
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#submitClickHandler);
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
      ?.addEventListener('change', this.#offerChangeHandler);
    this.#setDatepickerFromHandler();
    this.#setDatepickerToHandler();
  };

  get template() {
    return createPointEditFormTemplate({
      state: this._state,
      pointOffers: this.#offers,
      destinations: this.#destinations,
      editPointType: this.#editFormType,
    });
  }

  #tripPointDateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        dateFrom: userDate,
      }
    });
  };

  #tripPointDateToChangeHandler = ([userDate]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        dateTo: userDate,
      }
    });
  };

  #setDatepickerFromHandler = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateFrom,
        maxDate: this._state.point.dateTo,
        onChange: this.#tripPointDateFromChangeHandler,
      },
    );
  };

  #setDatepickerToHandler = () => {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateTo,
        minDate: this._state.point.dateFrom,
        onChange: this.#tripPointDateToChangeHandler,
      },
    );
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormDelete(this._state.point);
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormReset();
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormSubmit(this._state.point);
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

  get isDisabled() {
    return this._state.networkState.isDisabled;
  }

  get isSaving() {
    return this._state.networkState.isDisabled;
  }

  get isDeleting() {
    return this._state.networkState.isDeleting;
  }

  static parsePointToState = ({ point }) => ({ point });
  static parseStateToPoint = (state) => state.point;
}
