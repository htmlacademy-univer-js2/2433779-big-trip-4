import PointView from '../view/point-view';
import EditFormView from '../view/point-edit-view';
import { Mode } from '../consts';
import { render, replace, remove } from '../framework/render';
export default class PointPresenter {
  #pointListContainer = null;
  #mode = Mode.DEFAULT;
  #point = null;
  #destinationModel = null;
  #offerModel = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #pointComponent = null;
  #editFormComponent = null;
  constructor({pointListContainer, destinationModel, offerModel, handleDataChange, handleModeChange}){
    this.#pointListContainer = pointListContainer;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
    this.#handleDataChange = handleDataChange;
    this.#handleModeChange = handleModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;
    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#offerModel.getOffersByType(this.#point.type),
      destination: this.#destinationModel.getDestinationById(point.destination),
      onEditFormClick: this.#editFormClickHandler,
      onFavoriteClick: this.#favoriteClickHandler
    });

    this.#editFormComponent = new EditFormView({
      point: this.#point,
      offers: this.#offerModel.getOffersByType(point.type),
      destination: this.#destinationModel.getDestinationById(point.destination),
      onEditFormReset: this.#editFormResetHandler,
      onEditFormSubmit: this.#editFormSubmitHandler
    });

    if (!prevPointComponent || !prevEditFormComponent) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }
    remove(prevEditFormComponent);
    remove(prevPointComponent);
  }

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.#switchToPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  #switchToEditForm = () => {
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onDocumentEscKeydown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #switchToPoint = () => {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#onDocumentEscKeydown);
    this.#mode = Mode.DEFAULT;
  };

  #onDocumentEscKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#switchToPoint();
    }
  };

  #favoriteClickHandler = () => {
    this.#handleDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    });
  };

  #editFormClickHandler = () => {
    this.#switchToEditForm();
    document.removeEventListener('keydown', this.escKeydownHandler);
  };

  #editFormResetHandler = () => {
    this.#switchToPoint();
    document.removeEventListener('keydown', this.escKeydownHandler);
  };

  #editFormSubmitHandler = () => {
    this.#switchToPoint();
    document.removeEventListener('keydown', this.escKeydownHandler);
  };
}
