import { FILTER_TYPES } from '../consts';

export const createFilterTemplate = () => `<form class="trip-filters" action="#" method="get">
      ${FILTER_TYPES.map(( type ) => (`<div class="trip-filters__filter">
        <input id="filter-${ type }" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${ type }">
        <label class="trip-filters__filter-label" for="filter-${ type }">${ type }</label>
      </div>`)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
