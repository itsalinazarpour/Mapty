'use strict';

//prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');

class Workout {
  data = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // km
    this.duration = duration; // min
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance; // mim/km
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); // km/h
  }
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// APPLICATION ARCHITECTURE

const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  _map;
  _mapEvent;
  _workouts = [];

  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your current position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this._map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    // Handling clicks on maps
    this._map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    form.classList.remove('hidden');
    inputDistance.focus();

    this._mapEvent = mapE;
  }

  _newWorkout(e) {
    e.preventDefault();

    // GET DATA FROM FORM
    const type = inputType.value;
    const duration = +inputDuration.value;
    const distance = +inputDistance.value;
    const cadence = +inputCadence.value;
    const elevation = +inputElevation.value;
    const { lat, lng } = this._mapEvent.latlng;

    let workout;

    const isNumber = (...inputs) =>
      inputs.every((input) => Number.isFinite(input));
    const isPositive = (...inputs) => inputs.every((input) => input > 0);

    // IF WORKOUT IS RUNNING, CREATE RUNNING OBJECT
    if (type === 'running') {
      // CHECK IF DATA IS VALID
      if (
        !isNumber(duration, distance, cadence) ||
        !isPositive(duration, distance, cadence)
      )
        return alert('Inputs must be numbers or positive numbers');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // IF WORKOUT IS CYCLING, CREATE CYCLING OBJECT
    if (type === 'cycling') {
      // CHECK IF DATA IS VALID
      if (
        !isNumber(duration, distance, elevation) ||
        !isPositive(duration, distance)
      )
        return alert('Inputs must be positive number');

      workout = new Cycling([lat, lng], distance, duration, cadence);
    }

    // ADD NEW OBJECT TO WORKOUTS ARRAY
    this._workouts.push(workout);

    // RENDER WORKOUT ON MAP AS A MARKER
    this._renderWorkoutMarker(workout);

    // RENDER WORKOUT ON LIST

    // HIDE FORM + clear input fields
    inputDuration.value = inputDistance.value = inputCadence.value = inputElevation.value =
      '';
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this._map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent('Work out')
      .openPopup();
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }
}

const app = new App();
