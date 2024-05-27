import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import { render, RenderPosition } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';

export default class TripPresenter {
  #container = null;

  #pointsModel = null;
  #offerModel = null;
  #destinationModel = null;

  #points = null;

  #pointListComponent = null;
  #emptyPointListComponent = null;
  #sortComponent = null;
  #filterComponent = null;
  #tripInfoComponent = null;

  #pointPresenters = new Map();

  constructor({container, pointsModel, offerModel, destinationModel}) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;

    this.#points = [...this.#pointsModel.getPoints()];

    this.#pointListComponent = new PointListView(this.#points);
    this.#emptyPointListComponent = new EmptyPointListView(this.#points);
    this.#sortComponent = new SortView();
    this.#filterComponent = new FilterView(this.#points);
    this.#tripInfoComponent = new TripInfoView(this.#points, this.#destinationModel);
  }

  init(){
    this.#renderTrip();
  }

  #renderTrip = () => {
    if (!this.#points.length) {
      render(this.#emptyPointListComponent, this.#container.events);
      return;
    }

    this.#renderSort();
    this.#renderPointList();
    this.#renderPoints();
    this.#renderTripInfo();
    this.#renderFilter();
  };

  #renderSort() {
    render(this.#sortComponent, this.#container.events);
  }

  #renderPointList() {
    render(this.#pointListComponent, this.#container.events);
  }

  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #renderTripInfo() {
    render(this.#tripInfoComponent, this.#container.tripInfo, RenderPosition.AFTERBEGIN);
  }

  #renderFilter() {
    render(this.#filterComponent, this.#container.filter);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      destinationModel: this.#destinationModel,
      offerModel: this.#offerModel,
      handleDataChange: this.#handlePointChange,
      handleModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

  #handlePointChange = (updatePoint) => {
    this.#points = updateItem(this.#points, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
