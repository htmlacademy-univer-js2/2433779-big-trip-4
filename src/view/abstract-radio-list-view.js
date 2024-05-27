import AbstractView from '../framework/view/abstract-view';

export default class AbstractRadioListView extends AbstractView {
  #items = [];
  #onItemChange = null;

  constructor ({ items, onItemChange }) {
    super();
    this.#items = items;
    this.#onItemChange = onItemChange;
    this.element.addEventListener('change', this.#itemChangeHandler);
  }

  get items() {
    return this.#items;
  }

  #itemChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onItemChange?.(evt.target.dataset.item);
  };
}
