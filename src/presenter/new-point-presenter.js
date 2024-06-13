import { RenderPosition, render, remove } from '../framework/render';
import { UserAction, UpdateType, EditType } from '../consts';

import PointEditFormView from '../view/point-edit-form-view';

export default class NewPointPresenter {
  #newPointContainer = null;
  #newPointComponent = null;

  #destinationModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleDestroy = null;

  constructor ({newPointContainer, destinationModel, offersModel, onDataChange, onDestroy}) {
    this.#newPointContainer = newPointContainer;

    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;

    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init = () => {
    if (!this.#newPointComponent) {
      this.#newPointComponent = new PointEditFormView({
        offers: this.#offersModel.get(),
        destinations: this.#destinationModel.get(),
        pointEditType: EditType.CREATING,
        onPointEditFormReset: this.#handlePointEditFormClose,
        onPointEditFormSubmit: this.#handlePointEditFormSubmit,
      });
    }

    render(this.#newPointComponent, this.#newPointContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);

  };

  destroy = ({isCanceled = true} = {}) => {
    if (!this.#newPointComponent) {
      return;
    }
    remove(this.#newPointComponent);

    this.#newPointComponent = null;
    this.#handleDestroy({isCanceled});

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handlePointEditFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );

    this.destroy({ isCanceled: false });
  };

  #handlePointEditFormClose = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
