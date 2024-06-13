export const createFilterTemplate = ({filters, currentFilter}) => `
  <form class="trip-filters" action="#" method="get">
    ${filters.map(({ type, isDisabled}) => `
      <div class="trip-filters__filter">
        <input
          id="filter-${type}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${type}"
          data-item="${type}"
          ${isDisabled ? 'disabled' : ''}
          ${type === currentFilter ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${type}">
          ${type}
        </label>
      </div>
    `).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;
