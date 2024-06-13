import { sort, filter } from '../utils.js';
import { UpdateType, UserAction, SortType, FilterType, TimeLimit } from '../consts.js';
import { render, remove, RenderPosition, replace } from '../framework/render.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import PointListView from '../view/point-list-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorView from '../view/error-view.js';
import PointPresenter from './point-presenter.js';
import SortPresenter from './sort-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import TripInfoView from '../view/trip-info-view.js';

export default class TripPresenter {
  #tripContainer = null;
  #infoContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationModel = null;
  #filterModel = null;

  #currentSortType = SortType.DAY;
  #isCreating = false;
  #isLoading = true;
  #isError = false;

  #newPointButtonPresenter = null;
  #newPointPresenter = null;
  #sortPresenter = null;
  #pointPresenters = new Map();
  #filterPresenter = null;

  #loadingComponent = new LoadingView();
  #pointsListComponent = new PointListView();
  #errorComponent = new ErrorView();
  #emptyPointListComponent = null;
  #tripInfoComponent = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor ({container, pointsModel, offersModel, destinationModel, filterModel, newPointButtonPresenter, filterPresenter}) {
    this.#tripContainer = container.events;
    this.#infoContainer = container.tripInfo;

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
    this.#filterPresenter = filterPresenter;

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
    this.#pointsModel.init();
    this.#renderTrip();
  }


  #viewActionHandler = async (actionType, updateType, point) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(point.id).setSaving();
        try {
          await this.#pointsModel.update(updateType, point);
        } catch {
          this.#pointPresenters.get(point.id).setAborting();
        }
        break;

      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(point.id).setDeleting();
        try {
          await this.#pointsModel.delete(updateType, point);
        } catch {
          this.#pointPresenters.get(point.id).setAborting();
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.add(updateType, point);
        } catch {
          this.#newPointPresenter.setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        this.#renderTripInfo();
        break;

      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;

      case UpdateType.MAJOR:
        this.#clearTrip({ resetSortType: true });
        this.#renderTrip();
        break;

      case UpdateType.INIT:
        this.#isError = data.isError;
        this.#isLoading = false;
        this.#clearTrip();
        this.#renderTrip();
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#tripContainer);
  }

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

    remove(this.#loadingComponent);
  };

  #renderTripInfo = () => {
    const prevTripInfoComponent = this.#tripInfoComponent;

    const points = this.#pointsModel.get();
    const destinations = this.#destinationModel.get();
    const offers = this.#offersModel.get();

    this.#tripInfoComponent = new TripInfoView(points, destinations, offers);

    if (!prevTripInfoComponent) {
      render(
        this.#tripInfoComponent,
        this.#infoContainer,
        RenderPosition.AFTERBEGIN
      );
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  };

  #renderTrip = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      this.#newPointButtonPresenter.disableButton();
      return;
    }
    this.#renderTripInfo();
    if (this.#isError) {
      this.#renderError();
      this.#clearTrip({ resetSortType: true });
      return;
    }

    this.#newPointButtonPresenter.enableButton();

    if (!this.points.length && !this.#isCreating) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();
    this.#renderPointList();
    this.#renderPoints();
    this.#filterPresenter.init();

  };

  #renderError = () => {
    render(this.#errorComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
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
    this.#newPointPresenter.destroy();
  };
}
