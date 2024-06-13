import AbstractView from '../framework/view/abstract-view.js';
import { createFilterTemplate } from '../templates/filter-template.js';

export default class FilterView extends AbstractView {
  #currentFilter = null;
  #items = [];
  #onItemChange = null;

  constructor({items, onItemChange, currentFilter}) {
    super();
    this.#items = items;
    this.#onItemChange = onItemChange;
    this.#currentFilter = currentFilter;

    this.element.addEventListener('change', this.#itemChangeHandler);
  }

  get template() {
    return createFilterTemplate({ filters: this.#items, currentFilter: this.#currentFilter });
  }

  #itemChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onItemChange?.(evt.target.value);
  };
}
