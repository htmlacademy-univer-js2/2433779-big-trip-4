import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import { DATE, POINT_TYPES, PRICE, DESTINATIONS } from '../consts.js';
import { getRandomDestination } from './destination.js';
import { getOffers } from './offer.js';

export const generatePoint = () => {
  const id = getRandomInteger(DESTINATIONS.length);
  const basePrice = getRandomInteger(PRICE.min, PRICE.max);
  const date = getRandomArrayElement(DATE);
  const type = getRandomArrayElement(POINT_TYPES);
  const offersId = getOffers(type).map((offer) => offer.id);
  const destinationId = getRandomDestination().id;
  const isFavorite = Boolean(getRandomInteger(1));

  return {
    id: id,
    basePrice: basePrice,
    dateFrom: date.from,
    dateTo: date.to,
    destination: destinationId,
    isFavorite: isFavorite,
    offers: offersId,
    type: type
  };
};
