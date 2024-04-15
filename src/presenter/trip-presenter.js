import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import { render, RenderPosition, replace } from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripPresenter {
  #pointList = new PointListView();
  #container = null;
  #pointsModel = null;
  #offerModel;
  #destinationModel;
  #tripPoints = null;

  constructor({container, pointsModel, offerModel, destinationModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.getPoints()];
    render(this.#pointList, this.#container.events);
    render(new SortView(), this.#container.events);
    render(new FilterView(), this.#container.filter);
    render(new TripInfoView({points: this.#tripPoints}), this.#container.tripInfo, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderPoint(this.#tripPoints[i]);
    }
  }

  #renderPoint = (point) => {
    const pointComponent = new PointView({
      point: point,
      offersByPointType: this.#offerModel.getOffersByType(point.type),
      destination: this.#destinationModel.getDestinationById(point.destination),
      onEditClick: pointEditClickHandler
    });

    const editPointComponent = new PointEditView({
      point: point,
      offersByPointType: this.#offerModel.getOffersByType(point.type),
      destination: this.#destinationModel.getDestinationById(point.destination),
      onResetClick: resetButtonClickHandler,
      onSubmitClick: pointSubmitHandler
    });

    const replacePointToForm = () => {
      replace(editPointComponent, pointComponent);
    };

    const replaceFormToPoint = () => {
      replace(pointComponent, editPointComponent);
    };

    const escKeydownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc'){
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeydownHandler);

      }
    };

    function pointEditClickHandler() {
      replacePointToForm();
      document.removeEventListener('keydown', escKeydownHandler);
    }

    function resetButtonClickHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeydownHandler);
    }

    function pointSubmitHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeydownHandler);
    }

    render(pointComponent, this.#pointList.element);
  };
}
