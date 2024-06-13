import { SortType , enabledSortType} from '../consts';
import { render, remove } from '../framework/render';
import SortView from '../view/sort-view';

export default class SortPresenter {
  #sortContainer = null;
  #sortComponent = null;

  #handleSortTypeChange = null;
  #currentSortType = SortType.DAY;

  constructor({ sortContainer, onSortChange, currentSortType }) {
    this.#sortContainer = sortContainer;
    this.#handleSortTypeChange = onSortChange;
    this.#currentSortType = currentSortType;
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

  destroy() {
    remove(this.#sortComponent);
  }
}
