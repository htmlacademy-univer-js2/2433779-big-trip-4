import { getOffers } from '../mock/offer';
import Observable from '../framework/observable';

export default class OffersModel extends Observable{
  #offers = null;

  constructor() {
    super();
    this.#offers = getOffers();
  }

  get() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers.find((offer) => (offer.type === type))?.offers;
  }
}
