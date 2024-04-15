import { getOffersByType } from '../mock/offer';

export default class OffersModel {
  offers = getOffersByType();

  getOffers() {
    return this.offers;
  }

  getOffersByType(type) {
    return this.offers.find((offer) => (offer.type === type))?.offers;
  }
}
