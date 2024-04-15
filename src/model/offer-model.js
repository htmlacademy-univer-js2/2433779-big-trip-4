import { getOffers } from '../mock/offer';

export default class OffersModel {
  #offers = null;

  constructor() {
    this.#offers = getOffers();
  }

  getOffers() {
    return this.#offers;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => (offer.type === type))?.offers;
  }
}
