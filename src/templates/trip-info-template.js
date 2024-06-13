import dayjs from 'dayjs';

function getTripInfoTitle(cities) {
  if (cities.length > 3) {
    return `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`;
  } else {
    return cities.reduce((acc, city, index) => {
      if (index !== cities.length - 1) {
        acc += `${city} &mdash; `;
      } else {
        acc += `${city}`;
      }
      return acc;
    }, '');
  }
}

function getTripInfoStartDate(sortedPoints) {
  return dayjs(sortedPoints[0].dateFrom).format('DD MMM');
}

function getTripInfoEndDate(sortedPoints) {
  return dayjs(sortedPoints[sortedPoints.length - 1].dateTo).format('DD MMM');
}

function getOffersCost(offerIds = [], offers = []) {
  return offerIds.reduce(
    (result, id) => result + (offers.find((offer) => offer.id === id)?.price ?? 0),
    0
  );
}

function getTripCost(points = [], offers = []) {
  return points.reduce(
    (result, point) =>
      result + point.basePrice + getOffersCost(point.offers, offers.find((offer) => point.type === offer.type)?.offers),
    0);
}

export function createTripInfoTemplate(points, destinations, offers) {
  const totalCost = getTripCost(points, offers);
  const sortedPoints = points.sort((firstDate, secondDate) => new Date(firstDate.dateFrom) - new Date(secondDate.dateFrom));
  const cities = sortedPoints.map((point) => destinations.find((destination) => destination.id === point.destination).name);
  const tripInfoTitle = getTripInfoTitle(cities);

  return (
    `<section class="trip-main__trip-info  trip-info">
            ${points.length ? `<div class="trip-info__main">
              <h1 class="trip-info__title">${points.length ? tripInfoTitle : ''}</h1>
              <p class="trip-info__dates">${points.length ? getTripInfoStartDate(sortedPoints) : ''}&nbsp;&mdash;&nbsp;${points.length ? getTripInfoEndDate(sortedPoints) : ''}</p>
            </div>
            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${points.length ? totalCost : ''}</span>
            </p>
    </section>` : ''}`
  );
}
