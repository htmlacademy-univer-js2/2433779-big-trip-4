import { DESCRIPTIONS, DESTINATIONS } from '../consts';
import { getRandomArrayElement, getRandomInteger } from '../utils';

const createPicture = () => ({
  src: `https://loremflickr.com/248/152?random=${ getRandomInteger(100) }`,
  description: getRandomArrayElement(DESCRIPTIONS)
});

const getDestination = (destination, index) => ({
  id: index,
  description: getRandomArrayElement(DESCRIPTIONS),
  name: destination,
  pictures: Array.from({ length: getRandomInteger(5)}, createPicture)
});

const destinations = DESTINATIONS.map((destination, index) => getDestination(destination, index));

export const getDestinations = () => destinations;

export const getRandomDestination = () => getRandomArrayElement(destinations);
