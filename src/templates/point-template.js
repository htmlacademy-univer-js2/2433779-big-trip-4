import { getPointDuration } from '../utils';
import dayjs from 'dayjs';
import he from 'he';
function createOffersListTemplate(currentOffers, offers) {
  return `<ul class="event__selected-offers">
  ${currentOffers.filter((offer) => offers.includes(offer.id)).map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
  `).join('')}
  </ul>`;
}
export function createPointTemplate (point, offersByPointType, destination){
  const { basePrice, dateFrom, dateTo, isFavorite, offers, type } = point;
  const favouriteClassname = isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${ dateFrom }">${ dayjs(dateFrom).format('MMM DD') }</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${ type }.png" alt="Event ${ type } icon">
    </div>
    <h3 class="event__title">${ type } ${ destination ? he.encode(destination.name) : '' }</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${ dateFrom }">${ dayjs(dateFrom).format('HH:mm') }</time>
        &mdash;
        <time class="event__end-time" datetime="${ dateTo }">${ dayjs(dateTo).format('HH:mm') }</time>
      </p>
      <p class="event__duration">${ getPointDuration(dateFrom, dateTo) }</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${ basePrice }</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    ${offers.length > 0 ? createOffersListTemplate(offersByPointType, offers) : ''}
    <button class="event__favorite-btn ${ favouriteClassname }" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
}
