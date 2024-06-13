import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { SortType, TimePeriods } from './consts';
import { FilterType } from './consts';
dayjs.extend(duration);

const getPointsDateDifference = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
const getPointsPriceDifference = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
const getPointsDurationDifference = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
};
const sortMethod = {
  [SortType.DAY]: (points) => points.sort(getPointsDateDifference),
  [SortType.PRICE]: (points) => points.sort(getPointsPriceDifference),
  [SortType.TIME]: (points) => points.sort(getPointsDurationDifference),
};
const HUNDRED_DAYS = 100;

export const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

export const getRandomInteger = (max, min = 0) =>Math.round((max - min) * Math.random() + min);

export const getPointDuration = (dateFrom, dateTo) => {
  const pointDuration = dayjs(dateTo).diff(dayjs(dateFrom), 'minutes');
  const days = dayjs(dateTo).diff(dayjs(dateFrom), 'days');
  if (pointDuration >= TimePeriods.MinInDay) {
    if (days >= HUNDRED_DAYS) {
      return dayjs.duration(pointDuration, 'minutes').format(`${days}[D] HH[H] mm[M]`);
    }
    else {
      return dayjs.duration(pointDuration, 'minutes').format('DD[D] HH[H] mm[M]');
    }
  } else if (pointDuration >= TimePeriods.MinInHour) {
    return dayjs.duration(pointDuration, 'minutes').format('HH[H] mm[M]');
  }
  return dayjs.duration(pointDuration, 'minutes').format('mm[M]');
};

export function isFutureDate(dateFrom) {
  return dayjs(dateFrom).isAfter(dayjs());
}

export function isPastDate(dateTo) {
  return dayjs(dateTo).isBefore(dayjs());
}

export function isPresentDate(dateFrom, dateTo) {
  const now = dayjs();
  return now.isSameOrAfter(dateFrom) && now.isSameOrBefore(dateTo);
}

export const updateItem = (items, update) =>
  items.map((item) => item.id === update.id ? update : item);

export const sort = (points, sortType = SortType.DAY) => {
  if (!sortMethod[sortType]) {
    throw new Error(`Sort by ${sortType} is not implemented`);
  }
  return sortMethod[sortType](points);
};

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureDate(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentDate(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastDate(point.dateTo)),
};

export const isMajorDifference = (pointA, pointB) => {
  const aPointDuration = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const bPointDuration = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return pointA.dateFrom !== pointB.dateFrom ||
  pointA.basePrice !== pointB.basePrice ||
  aPointDuration !== bPointDuration;
};

export const getLastWord = (string) => {
  const words = string.split(' ');
  return words.at(-1);
};

export function adaptToServer(point) {
  const adaptedPoint = {
    ...point,
    ['base_price']: Number(point.basePrice),
    ['date_from']: new Date(point.dateFrom).toISOString(),
    ['date_to']: new Date(point.dateTo).toISOString(),
    ['is_favorite']: point.isFavorite
  };

  delete adaptedPoint.basePrice;
  delete adaptedPoint.dateFrom;
  delete adaptedPoint.dateTo;
  delete adaptedPoint.isFavorite;

  return adaptedPoint;
}

export function adaptToClient(point) {
  const adaptedPoint = {
    ...point,
    basePrice: point['base_price'],
    dateFrom: point['date_from'],
    dateTo: point['date_to'],
    isFavorite: point['is_favorite'],
  };

  delete adaptedPoint['base_price'];
  delete adaptedPoint['date_from'];
  delete adaptedPoint['date_to'];
  delete adaptedPoint['is_favorite'];

  return adaptedPoint;
}
