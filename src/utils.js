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
