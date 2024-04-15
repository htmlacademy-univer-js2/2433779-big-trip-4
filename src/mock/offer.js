import { POINT_TYPES, OFFERS, PRICE } from '../consts';
import { getRandomArrayElement, getRandomInteger } from '../utils';

const generateOffer = () => ({
  id: crypto.randomUUID(),
  title: getRandomArrayElement(OFFERS),
  price: getRandomInteger(PRICE.min, PRICE.max),
});

const offersByType = POINT_TYPES.map((type) => ({
  type,
  offers: Array.from({ length: getRandomInteger(OFFERS.length)}, generateOffer)
}));

export const getOffers = () => offersByType;

export const getOfferByCurrentPointType = (type) => offersByType.find((offer) => offer.type === type).offers;
