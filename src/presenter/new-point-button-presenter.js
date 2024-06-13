import { render } from '../framework/render';
import NewPointButtonView from '../view/new-point-button-view';

export default class NewPointButtonPresenter {
  #newPointButtonContainer = null;
  #button = null;

  constructor ({newPointButtonContainer}) {
    this.#newPointButtonContainer = newPointButtonContainer;
  }

  init = ({onClick}) => {
    this.#button = new NewPointButtonView({onClick});
    render(this.#button, this.#newPointButtonContainer);
  };

  disableButton() {
    this.#button.setDisabled(true);
  }

  enableButton() {
    this.#button.setDisabled(false);
  }
}
