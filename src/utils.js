import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
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
