import { AJAX } from './helper.js';

export const state = {
  workouts: [],
};

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  sortToggle = false; // TRUE = DISTANCE, FALSE = DATE

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // km
    this.duration = duration; // min
  }

  _setDateDescription() {
    //prettier-ignore
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // prettier-ignore
    this.dateDescription = `${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }
}

export class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDateDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance; // mim/km
    return this.pace;
  }
}

export class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDateDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); // km/h
  }
}

// GET GEO CODE BY COORDINATES FROM GEOCODE.XYZ
export const getGeoCode = async function (workout) {
  try {
    const [lat, lng] = workout.coords;
    const data = await AJAX(
      `https://geocode.xyz/${lat},${lng}?geoit=json`,
      'Please try to reload the page again. Unfortunately, this api what I am using now can not read all datas at once and I am not willing to pay for the API. Error occurs from this reason.'
    );

    return data.osmtags.name;
  } catch (err) {
    console.error(err);
    return '';
  }
};

// GET WEATHER BY COORDINATES FROM OPEN WEATHER API
export const getWeatherData = async function (workout) {
  try {
    const myKey = '5c04291f0b2520cd23ea484f5b1e34e2';
    const [lat, lng] = workout.coords;

    const data = await AJAX(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${myKey}`,
      'Failed to load data from API'
    );

    const { icon } = data.weather[0];

    return `http://openweathermap.org/img/wn/${icon}@2x.png`;
  } catch (err) {
    throw err;
  }
};

export const setLocalStorage = function (workouts) {
  localStorage.setItem('workouts', JSON.stringify(workouts));
};

export const getLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem('workouts'));

  if (!data) return;
  state.workouts = data;
};

export const clearLocalStorage = function () {
  localStorage.removeItem('workouts');
};

clearLocalStorage();
