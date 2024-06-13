import PointsModel from './model/points-model';
import TripPresenter from './presenter/trip-presenter';
import DestinationModel from './model/destination-model';
import OffersModel from './model/offers-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButtonPresenter from './presenter/new-point-button-presenter';
import { RenderPosition, render } from './framework/render';
import TripInfoView from './view/trip-info-view';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripInfoContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');
const destinationModel = new DestinationModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const container = {
  filter: filterContainer,
  tripInfo: tripInfoContainer,
  events: eventsContainer
};

const newPointButtonPresenter = new NewPointButtonPresenter({
  newPointButtonContainer: container.tripInfo,
});

const tripPresenter = new TripPresenter({
  tripContainer: container.events,
  pointsModel,
  offersModel,
  destinationModel,
  filterModel,
  newPointButtonPresenter,
});

render(new TripInfoView(pointsModel.get(), destinationModel), container.tripInfo, RenderPosition.AFTERBEGIN);

const filterPresenter = new FilterPresenter({
  filterContainer: container.filter,
  pointsModel,
  filterModel
});

newPointButtonPresenter.init({
  onClick: tripPresenter.createNewPointButtonClickHandler,
});

tripPresenter.init();
filterPresenter.init();
