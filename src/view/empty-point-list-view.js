import AbstractView from '../framework/view/abstract-view.js';
import { createEmptyPointListTemplate } from '../templates/empty-point-list-template.js';


export default class EmptyPointListView extends AbstractView{
  #points;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createEmptyPointListTemplate();
  }
}
