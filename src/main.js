import PointsModel from './model/points-model';
import TripPresenter from './presenter/trip-presenter';
import DestinationModel from './model/destination-model';
import OffersModel from './model/offers-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButtonPresenter from './presenter/new-point-button-presenter';
import PointsApiService from './service/points-api-service';
import { AUTHORIZATION, END_POINT } from './consts';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripInfoContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');
const container = {
  filter: filterContainer,
  tripInfo: tripInfoContainer,
  events: eventsContainer
};
const service = new PointsApiService(END_POINT, AUTHORIZATION);

const destinationModel = new DestinationModel({service});
const offersModel = new OffersModel({service});
const pointsModel = new PointsModel({service, destinationModel, offersModel});
const filterModel = new FilterModel();

const newPointButtonPresenter = new NewPointButtonPresenter({
  newPointButtonContainer: container.tripInfo,
});

const filterPresenter = new FilterPresenter({
  filterContainer: container.filter,
  pointsModel,
  filterModel
});

const tripPresenter = new TripPresenter({
  container: container,
  pointsModel,
  offersModel,
  destinationModel,
  filterModel,
  newPointButtonPresenter,
  filterPresenter
});

newPointButtonPresenter.init({
  onClick: tripPresenter.createNewPointButtonClickHandler,
});

tripPresenter.init();
