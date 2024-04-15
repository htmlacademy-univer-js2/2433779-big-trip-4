const createRouteElement = (points, destinationModel) => {
  const destinationIds = Array.from(points, (point) => (point.destination));
  const destinationNames = destinationIds.map((destinationId) => (destinationModel.getDestinationById(destinationId))).map((destination) => destination.name);

  return `<h1 class="trip-info__title">
    ${ destinationNames.map((name) => `${ name }`).join(' &mdash; ')}
  </h1>`;
};

export const createTripInfoTemplate = (points, destinationModel) => {
  const pointsCount = points.length;
  if (pointsCount > 0) {
    return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${ createRouteElement(points, destinationModel) }
      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>
  </section>`;
  }
  else{
    return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">Ваш маршрут пустует :(</h1>
    </div>
  </section>`;
  }
};
