import Observable from '../framework/observable.js';
import {FilterType} from '../consts.js';
export default class FilterModel extends Observable {
  #currentFilter = FilterType.EVERYTHING;

  set(updateType, update) {
    this.#currentFilter = update;
    this._notify(updateType, update);
  }

  get() {
    return this.#currentFilter;
  }
}
