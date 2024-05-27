import { SortType } from '../consts';
import { enabledSortType } from '../consts';
import SortView from '../view/sort-view';
import { render } from '../framework/render';

export default class SortPresenter {
  #sortContainer = null;
  #sortComponent = null;
  #handleSortTypeChange = null;
  #currentSortType = SortType.DAY;

  constructor({ sortContainer, handleSortTypeChange }) {
    this.#sortContainer = sortContainer;
    this.#handleSortTypeChange = handleSortTypeChange;
  }

  init() {
    const sortTypes = this.#renderSortTypes();

    this.#sortComponent = new SortView({
      items: sortTypes,
      onItemChange: this.#onSortChange,
    });

    render(this.#sortComponent, this.#sortContainer);
  }

  #renderSortTypes = () => Object.values(SortType).map((type) => ({
    type,
    isChecked: type === this.#currentSortType,
    isDisabled: !enabledSortType[type],
  }));

  #onSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#handleSortTypeChange(sortType);
  };
}
