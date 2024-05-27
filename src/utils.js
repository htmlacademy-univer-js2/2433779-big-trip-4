import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { SortType } from './consts';
dayjs.extend(duration);

export const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];
export const getRandomInteger = (max, min = 0) =>Math.round((max - min) * Math.random() + min);
export function getTimeInHours(startTime, endTime) {
  const hours = dayjs(endTime).diff(dayjs(startTime), 'hours');
  return hours !== 0 ? `${hours }H` : '';
}

export function getTimeInMinutes(startTime, endTime) {
  const minutes = dayjs(endTime).diff(dayjs(startTime), 'minutes') % 60;
  return minutes !== 0 ? `${minutes }M` : '';
}

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

export const sort = (points, sortType = SortType.DAY) => {
  if (!sortMethod[sortType]) {
    throw new Error(`Sort by ${sortType} is not implemented`);
  }
  return sortMethod[sortType](points);
};
