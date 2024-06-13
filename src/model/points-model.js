import Observable from '../framework/observable';
import { adaptToClient } from '../utils';
import { UpdateType } from '../consts';

export default class PointsModel extends Observable {
  #points = [];
  #service = null;
  #destinationModel = null;
  #offersModel = null;

  constructor({service, destinationModel, offersModel}) {
    super();
    this.#service = service;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
  }

  async init () {
    try {
      await Promise.all([
        this.#destinationModel.init(),
        this.#offersModel.init()
      ]);

      const points = await this.#service.getPoints();
      this.#points = points.map(adaptToClient);

      this._notify(UpdateType.INIT, {isError: false});
    } catch(error) {
      this.#points = [];
      this._notify(UpdateType.INIT, {isError: true});
    }
  }

  get() {
    return this.#points;
  }

  async update(updateType, point) {
    try {
      const response = await this.#service.updatePoint(point);
      const adaptedPoint = adaptToClient(response);
      const index = this.#points.findIndex((p) => p.id === point.id);
      if (index === -1) {
        throw new Error('Can\'t update unexisting point');
      }
      this.#points = [
        ...this.#points.slice(0, index),
        adaptedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, adaptedPoint);
    } catch(error) {
      throw new Error('Can\'t update point');
    }
  }

  async add(updateType, point) {
    try{
      const response = await this.#service.addPoint(point);
      const adaptedPoint = adaptToClient(response);
      this.#points = [
        adaptedPoint,
        ...this.#points
      ];

      this._notify(updateType, adaptedPoint);
    } catch(error) {
      throw new Error('Can\'t add point');
    }
  }

  async delete(updateType, point) {
    try {
      const index = this.#points.findIndex((p) => p.id === point.id);
      if (index === -1) {
        throw new Error('Can\'t delete unexisting point');
      }

      await this.#service.deletePoint(point);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);
    } catch(error) {
      throw new Error('Can\'t delete point');
    }
  }
}
