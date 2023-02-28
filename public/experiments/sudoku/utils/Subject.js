export default class Subject {
  constructor () {
    this._observers = new Set();
  }
  
  registerObserver (obs) {
    if(!obs.update) {
      throw new Error("No update method on observer");
    }
    this._observers.add(obs);
  }

  unregisterObserver (obs) {
    this._observers.remove(obs);
  }

  notifyObservers (value=this) {
    for(var obs of this._observers) {
      obs.update(value);
    }
  }
}