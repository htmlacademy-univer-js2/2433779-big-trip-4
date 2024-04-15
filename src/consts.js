export const POINT_COUNT = 3;
export const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
export const DESTINATIONS = ['Amsterdam', 'Chamonix', 'Geneva', 'Paris', 'Saint Petersburg', 'Vienna'];
export const FILTER_TYPES = ['everything', 'future', 'present', 'past'];
export const OFFERS = ['Add luggage', 'Switch to comfort class', 'Add meal', 'Choose seats', 'Travel by train'];
export const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'];
export const DATE = [
  {
    from: '2024-03-18T10:30',
    to: '2024-03-18T16:00'
  },
  {
    from: '2024-03-18T16:20',
    to: '2024-03-18T17:00'
  },
  {
    from: '2024-03-19T14:20',
    to: '2024-03-19T15:00'
  },
  {
    from: '2024-03-19T16:00',
    to: '2024-03-19T17:00'
  },
  {
    from: '2024-03-19T18:00',
    to: '2024-03-19T19:00'
  }
];
export const PRICE = {
  min: 40,
  max: 3000
};
export const DEFAULT_POINT = {
  id: null,
  type: null,
  price: null,
  date: null,
  destination: null,
  offer: null,
  isFavorite: false,
};
export const TimePeriods = {
  HoursInDay: 24,
  MinInHour: 60,
  SecInHour: 60,
  MsecInSec: 1000
};
