import { getDestinations } from '../mock/destination';
export default class DestinationModel {
  #destinations = null;
  constructor() {
    this.#destinations = getDestinations();
  }

  getAllDestinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => (destination.id === id));
  }
}
