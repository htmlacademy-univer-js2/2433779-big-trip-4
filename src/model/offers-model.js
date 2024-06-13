import Observable from '../framework/observable';

export default class OffersModel extends Observable{
  #offers = [];
  #service = null;

  constructor({service}) {
    super();
    this.#service = service;
  }

  async init() {
    this.#offers = await this.#service.getOffers();
    return this.#offers;
  }

  get() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers.find((offer) => (offer.type === type))?.offers;
  }
}
