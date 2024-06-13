import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(duration);

export const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight',
};

export const TimePeriods = {
  MinInHour: 60,
  MinInDay: 1440
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

export const enabledSortType = {
  [SortType.DAY]: true,
  [SortType.EVENT]: false,
  [SortType.TIME]: true,
  [SortType.PRICE]: true,
  [SortType.OFFER]: false,
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE',
  ADD_POINT: 'ADD',
  DELETE_POINT: 'DELETE',
};

export const EditType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING',
};

export const EmptyListMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

export const AUTHORIZATION = 'Basic fjndkwf4232n323n32ln';

export const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

export const Method = {
  PUT: 'PUT',
  GET: 'GET',
  DELETE: 'DELETE',
  POST: 'POST',
};

export const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
