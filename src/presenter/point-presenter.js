import { Mode, UpdateType, UserAction, EditType } from '../consts';
import { render, replace, remove } from '../framework/render';
import { isMajorDifference } from '../utils';

import PointView from '../view/point-view';
import PointEditFormView from '../view/point-edit-form-view';


export default class PointPresenter {
  #pointsListContainer = null;

  #mode = Mode.DEFAULT;
  #point = null;

  #destinationModel = null;
  #offersModel = null;

  #onDataChange = null;
  #onModeChange = null;

  #pointComponent = null;
  #pointEditFormComponent = null;

  constructor({pointsListContainer, destinationModel, offersModel, handleDataChange, handleModeChange}){
    this.#pointsListContainer = pointsListContainer;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#onDataChange = handleDataChange;
    this.#onModeChange = handleModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditFormComponent = this.#pointEditFormComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#offersModel.getByType(this.#point.type),
      destination: this.#destinationModel.getById(point.destination),
      onPointEditFormClick: this.#pointEditFormClickHandler,
      onFavoriteClick: this.#favoriteClickHandler
    });

    this.#pointEditFormComponent = new PointEditFormView({
      point: this.#point,
      offers: this.#offersModel.get(),
      destinations: this.#destinationModel.get(),
      onPointEditFormReset: this.#pointEditFormResetHandler,
      onPointEditFormSubmit: this.#pointEditFormSubmitHandler,
      onPointEditFormDelete: this.#pointEditFormDeleteHandler,
      pointEditType: EditType.EDITING,
    });

    if (!prevPointComponent || !prevPointEditFormComponent) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditFormComponent, prevPointEditFormComponent);
    }

    remove(prevPointEditFormComponent);
    remove(prevPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditFormComponent);
  }

  #switchToPointEditForm = () => {
    replace(this.#pointEditFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onDocumentEscKeydown);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  };

  #switchToPoint = () => {
    replace(this.#pointComponent, this.#pointEditFormComponent);
    document.removeEventListener('keydown', this.#onDocumentEscKeydown);
    this.#mode = Mode.DEFAULT;
  };

  #onDocumentEscKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointEditFormComponent.reset(this.#point);
      this.#switchToPoint();
    }
  };

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditFormComponent.reset(this.#point);
      this.#switchToPoint();
    }
  }

  #favoriteClickHandler = () => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite,
      });
  };

  #pointEditFormClickHandler = () => {
    this.#switchToPointEditForm();
    document.removeEventListener('keydown', this.escKeydownHandler);
  };

  #pointEditFormResetHandler = () => {
    this.#pointEditFormComponent.reset(this.#point);
    this.#switchToPoint();
    document.removeEventListener('keydown', this.escKeydownHandler);
  };

  #pointEditFormSubmitHandler = (updatePoint) => {
    const isMinor = isMajorDifference(updatePoint, this.#point);

    this.#onDataChange(
      UserAction.UPDATE_POINT,
      isMinor ? UpdateType.MINOR : UpdateType.PATCH,
      updatePoint
    );

    this.#switchToPoint();
    document.removeEventListener('keydown', this.escKeydownHandler);
  };

  #pointEditFormDeleteHandler = (point) => {
    this.#onDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
