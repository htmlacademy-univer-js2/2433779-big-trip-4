import { remove, render, replace } from '../framework/render';
import { filter } from '../utils';
import { UpdateType } from '../consts';

import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #filterContainer = null;
  #filterComponent = null;

  #pointsModel;
  #filterModel = null;

  constructor({filterContainer, pointsModel, filterModel}) {
    this.#filterContainer = filterContainer;

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#modelChangeHandler);
  }

  get filters() {
    const points = this.#pointsModel.get();
    const result = Object.entries(filter).map(([filterType, filterPoints]) =>
      ({
        type: filterType,
        isDisabled: filterPoints(points).length === 0,
      }),
    );

    return result;
  }

  init(){
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      items: this.filters,
      onItemChange: this.#filterTypeChangeHandler,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #filterTypeChangeHandler = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.set(UpdateType.MAJOR, filterType);
  };

  #modelChangeHandler = () => {
    this.init();
  };
}
