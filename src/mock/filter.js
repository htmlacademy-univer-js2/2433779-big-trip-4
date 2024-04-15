import { filter } from '../consts.js';

function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      isDisabled: filterPoints(points).length === 0,
    }),
  );
}

export {generateFilter};
