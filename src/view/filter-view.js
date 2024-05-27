import { createFilterTemplate } from '../templates/filter-template.js';
import AbstractView from '../framework/view/abstract-view.js';
import { filter } from '../consts.js';

export default class FilterView extends AbstractView{
  #filters;

  constructor(points) {
    super();
    this.#filters = this.#generateFilters(points);
  }

  #generateFilters = (points) => Object.entries(filter).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      isDisabled: filterPoints(points).length === 0,
    }),
  );

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
