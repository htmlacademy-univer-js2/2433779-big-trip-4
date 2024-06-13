import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import { DATE, POINT_TYPES, PRICE } from '../consts.js';
import { getRandomDestination } from './destination.js';
import { getOfferByCurrentPointType } from './offer.js';

export const generatePoint = () => {
  const id = crypto.randomUUID();
  const basePrice = getRandomInteger(PRICE.min, PRICE.max);
  const date = getRandomArrayElement(DATE);
  const type = getRandomArrayElement(POINT_TYPES);
  const offersId = getOfferByCurrentPointType(type).map((offer) => offer.id);
  const destinationId = getRandomDestination().id;
  const isFavorite = Boolean(getRandomInteger(1));

  return {
    id,
    basePrice,
    dateFrom: date.from,
    dateTo: date.to,
    destination: destinationId,
    isFavorite,
    offers: offersId,
    type
  };
};
