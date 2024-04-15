import { createFilterTemplate } from '../templates/filter-template.js';
import AbstractView from '../framework/view/abstract-view.js';

export default class FilterView extends AbstractView{
  #filters;

  constructor({ filters }) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
