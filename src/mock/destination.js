import { DESCRIPTIONS, DESTINATIONS } from '../consts';
import { getRandomArrayElement, getRandomInteger } from '../utils';

const generatePicture = () => ({
  src: `https://loremflickr.com/248/152?random=${ getRandomInteger(100) }`,
  description: getRandomArrayElement(DESCRIPTIONS)
});

const generateDestination = (destination, id) => ({
  id: id,
  description: getRandomArrayElement(DESCRIPTIONS),
  name: destination,
  pictures: Array.from({ length: getRandomInteger(5)}, generatePicture)
});

const destinations = DESTINATIONS.map((destination, id) => generateDestination(destination, id));

export const getDestinations = () => destinations;

export const getRandomDestination = () => getRandomArrayElement(destinations);
