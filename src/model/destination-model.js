import Observable from '../framework/observable';

export default class DestinationModel extends Observable {
  #destinations = [];
  #service = null;

  constructor({service}) {
    super();
    this.#service = service;
  }

  async init() {
    this.#destinations = await this.#service.getDestinations();
    return this.#destinations;
  }

  get() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => (destination.id === id));
  }
}
