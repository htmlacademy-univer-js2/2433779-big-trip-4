import { EmptyListMessage } from '../consts.js';
import AbstractView from '../framework/view/abstract-view.js';
import { createEmptyPointListTemplate } from '../templates/empty-point-list-template.js';

export default class EmptyPointListView extends AbstractView{
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyPointListTemplate(EmptyListMessage[this.#filterType]);
  }
}
