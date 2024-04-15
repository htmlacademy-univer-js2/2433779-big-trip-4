import PointsModel from './model/point-model';
import TripPresenter from './presenter/trip-presenter';
import DestinationModel from './model/destination-model';
import OffersModel from './model/offer-model';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripInfoContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');

const container = {
  filter: filterContainer,
  tripInfo: tripInfoContainer,
  events: eventsContainer
};

const destinationModel = new DestinationModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel({destinationModel, offersModel});
const tripPresenter = new TripPresenter({container: container, pointsModel: pointsModel});

tripPresenter.init();
