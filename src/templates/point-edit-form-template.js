import { EditType, POINT_TYPES } from '../consts';
import dayjs from 'dayjs';
import he from 'he';
import { getLastWord } from '../utils';

function createEventItems() {
  return POINT_TYPES.map((type) => (
    `<div class="event__type-item">
      <input id="event-type-${ type }-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${ type }">
      <label class="event__type-label  event__type-label--${ type }" for="event-type-${ type }-1">${ type }</label>
    </div>`)).join('');
}
function createEventSelector() {
  return `<input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${ createEventItems() }
    </fieldset>
  </div>`;
}

function createDestinationList(destinations) {
  // console.log(destinations);
  return `<datalist id="destination-list-1">
  ${ destinations.map((destination) => `<option value="${ destination.name }"></option>`).join('') }
  </datalist>`;
}

function createPicturesSection(pictures) {
  return pictures ? `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${ pictures.map((picture) => (`<img class="event__photo" src="${ picture.src }" alt="${ picture.description }">`)).join('') }
    </div>
  </div>` : '';
}

function createCurrentDestinationBlock(currentDestination) {
  return currentDestination ? `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">${ currentDestination.name }</h3>
  <p class="event__destination-description">${ currentDestination.description }</p>
  ${ createPicturesSection(currentDestination.pictures) }
</section>` : '';
}

function createOffersSelector({ offers, currentOffers }) {
  function createOfferItem() {
    return currentOffers.map((item) => {
      const checkedClassname = offers.some((curValue) => (curValue === item.id)) ? 'checked' : '';
      const slug = getLastWord(item.title);
      return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${slug}-${item.id}" type="checkbox" name="event-offer-${slug}" ${checkedClassname}>
      <label class="event__offer-label" for="event-offer-${slug}-${item.id}">
        <span class="event__offer-title">${item.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </label>
    </div>`;
    }).join('');
  }

  return currentOffers ? `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
    ${createOfferItem()}
  </div>
</section>` : '';
}

export function createPointEditFormTemplate ({point, pointOffers, destinations, editPointType}) {
  // console.log(destinations);
  const { basePrice, dateFrom, dateTo, offers, type } = point;
  const currentDestination = destinations.find((destination) => destination.id === point.destination);
  const currentOffers = pointOffers.find((offer) => offer.type === type)?.offers;

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${ type }.png" alt="Event ${ type } icon">
        </label>
        ${ createEventSelector() }
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${ type }
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination-1" value="${currentDestination ? he.encode(currentDestination.name) : ''}" list="destination-list-1">
        ${ createDestinationList(destinations) }
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom ? dayjs(dateFrom).format('DD/MM/YY HH:mm') : ''}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo ? dayjs(dateTo).format('DD/MM/YY HH:mm') : ''}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(basePrice.toString())}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${editPointType === EditType.CREATING ? 'Cancel' : 'Delete'}</button>
      ${editPointType === EditType.EDITING ? `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>` : ''}
    </header>
    <section class="event__details">
      ${createOffersSelector({ offers, currentOffers })}
      ${createCurrentDestinationBlock(currentDestination)}
    </section>
  </form>
  </li>`;
}
