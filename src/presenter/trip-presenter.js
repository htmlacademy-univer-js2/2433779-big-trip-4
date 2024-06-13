import { sort, filter } from '../utils.js';
import { UpdateType, UserAction, SortType, FilterType } from '../consts.js';
import { render, remove } from '../framework/render.js';

import EmptyPointListView from '../view/empty-point-list-view.js';
import PointListView from '../view/point-list-view.js';

import PointPresenter from './point-presenter.js';
import SortPresenter from './sort-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

export default class TripPresenter {
  #tripContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationModel = null;
  #filterModel = null;
  #currentSortType = SortType.DAY;
  #isCreating = false;

  #newPointButtonPresenter = null;
  #newPointPresenter = null;
  #sortPresenter = null;
  #pointPresenters = new Map();

  #pointsListComponent = new PointListView();
  #emptyPointListComponent = null;

  constructor ({tripContainer, pointsModel, offersModel, destinationModel, filterModel, newPointButtonPresenter}) {
    this.#tripContainer = tripContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationModel = destinationModel;
    this.#filterModel = filterModel;

    this.#newPointButtonPresenter = newPointButtonPresenter;
    this.#newPointPresenter = new NewPointPresenter({
      newPointContainer: this.#pointsListComponent.element,
      destinationModel: this.#destinationModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionHandler,
      onDestroy: this.#createNewPointButtonDestroyHandler,
    });

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    const filterType = this.#filterModel.get();
    const points = this.#pointsModel.get();
    const filteredPoints = filter[filterType](points);

    return sort(filteredPoints, this.#currentSortType);
  }

  init() {
    this.#renderTrip();
  }


  #viewActionHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.update(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.delete(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.add(updateType, update);
        break;
    }
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({ resetSortType: true });
        this.#renderTrip();
        break;
    }
  };

  #clearTrip = ({resetSortType = false} = {}) => {
    this.#clearPoints();

    remove(this.#emptyPointListComponent);
    if (this.#sortPresenter) {
      this.#sortPresenter.destroy();
      this.#sortPresenter = null;
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };


  #renderTrip = () => {
    if (!this.points.length && !this.#isCreating) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#renderPointList();
    this.#renderPoints();
  };

  #renderEmptyList = () => {
    this.#emptyPointListComponent = new EmptyPointListView({
      filterType: this.#filterModel.get(),
    });

    render(this.#emptyPointListComponent, this.#tripContainer);
  };

  #renderPointList() {
    render(this.#pointsListComponent, this.#tripContainer);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      destinationModel: this.#destinationModel,
      offersModel: this.#offersModel,
      handleDataChange: this.#viewActionHandler,
      handleModeChange: this.#modeChangeHandler,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderSort() {
    this.#sortPresenter = new SortPresenter({
      sortContainer: this.#tripContainer,
      currentSortType: this.#currentSortType,
      onSortChange: this.#sortTypeChangeHandler,
    });

    this.#sortPresenter.init();
  }

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPointList();
    this.#renderPoints();
  };

  createNewPointButtonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButtonPresenter.disableButton();
    this.#newPointPresenter.init();
  };

  #createNewPointButtonDestroyHandler = ({isCanceled}) => {
    this.#isCreating = false;
    this.#newPointButtonPresenter.enableButton();

    if (!this.points.length && isCanceled) {
      this.#clearTrip();
      this.#renderTrip();
    }
  };


  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
