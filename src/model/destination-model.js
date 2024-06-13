import { getDestinations } from '../mock/destination';
import Observable from '../framework/observable';

export default class DestinationModel extends Observable {
  #destinations = null;

  constructor() {
    super();
    this.#destinations = getDestinations();
  }

  get() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => (destination.id === id));
  }
}
