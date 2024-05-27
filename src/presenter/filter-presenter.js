import FilterView from '../view/filter-view';
import { render } from '../framework/render';
import { filter } from '../consts';

export default class FilterPresenter {
  #filterContainer;
  #points;
  #filters;
  #filterComponent;

  constructor({filterContainer, points}) {
    this.#filterContainer = filterContainer;
    this.#points = points;
    this.#filters = this.#generateFilters(this.#points);
    this.#filterComponent = new FilterView(this.#filters);
  }

  #generateFilters = (points) => Object.entries(filter).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      isDisabled: filterPoints(points).length === 0,
    }),
  );

  init(){
    render(this.#filterComponent, this.#filterContainer);
  }
}
