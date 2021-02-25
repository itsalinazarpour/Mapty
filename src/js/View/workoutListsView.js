import 'core-js/stable';
// // FOR ASYNC POLIFILLING ASYNC FUNCTION
import 'regenerator-runtime/runtime';
import 'leaflet';

import icons from 'url:../../svg/sprite.svg';
// import logoIcon from 'url:../img/icon.png';

import View from './View.js';
import { isNumber, isPositive, setDescription } from '../helper.js';

class WorkoutListsView extends View {
  _errMsg = `⚠️ Characters or Symbols and Negative Numbers are NOT allowed for inputs.⚠️ <br />Only Positive Numbers are permitted unless elevation field. <br />
    On elevation input, Negative number is good to put!😄`;
  _mapEvent;

  _form = document.querySelector('.form');
  _inputType = document.querySelector('.form__input--type');
  _inputDistance = document.querySelector('.form__input--distance');
  _inputDuration = document.querySelector('.form__input--duration');
  _inputCadence = document.querySelector('.form__input--cadence');
  _inputElevation = document.querySelector('.form__input--elevation');
  _inputType = document.querySelector('.form__input--type');

  constructor() {
    super();
    this._addHandlerSelect();
    this._defaultElevationField();
  }

  newWorkout(running, cycling, workouts) {
    // GET DATA FROM FORM
    const type = this._inputType.value;
    const duration = +this._inputDuration.value;
    const distance = +this._inputDistance.value;
    const cadence = +this._inputCadence.value;
    const elevation = +this._inputElevation.value;
    const { lat, lng } = this._mapEvent.latlng;

    let workout;

    // IF WORKOUT IS RUNNING, CREATE RUNNING OBJECT
    if (type === 'running') {
      // CHECK IF DATA IS VALID
      if (
        !isNumber(duration, distance, cadence) ||
        !isPositive(duration, distance, cadence)
      )
        return this.renderError();

      workout = new running([lat, lng], distance, duration, cadence);
      // workout = new model.Running([lat, lng], distance, duration, cadence);
    }

    // IF WORKOUT IS CYCLING, CREATE CYCLING OBJECT
    if (type === 'cycling') {
      // CHECK IF DATA IS VALID
      if (
        !isNumber(duration, distance, elevation) ||
        !isPositive(duration, distance)
      )
        return this.renderError();

      workout = new cycling([lat, lng], distance, duration, elevation);
    }

    // ADD NEW OBJECT TO WORKOUTS ARRAY
    workouts.push(workout);

    // RENDER WORKOUT ON LIST
    this._renderWorkout(workout);

    // HIDE FORM + clear input fields
    this._hideForm();
  }

  addHandlerForm(handler) {
    this._form.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  addHandlerUpdate() {}

  _addHandlerSelect() {
    // prettier-ignore
    this._inputType.addEventListener('change', this._toggleElevationField.bind(this));
  }

  showForm(mapE) {
    this._form.classList.remove('hidden');
    this._clearInputFields();
    this._inputDistance.focus();

    // mapE = EVENT TO GET LOCATION FROM LEAFLET MAP
    this._mapEvent = mapE;
  }

  _hideForm() {
    // CLEAR INPUT FIELDS
    this._clearInputFields();

    // TRICK TO PREVENT ANIMATION
    this._form.style.display = 'none';
    this._form.classList.add('hidden');
    setTimeout(() => (this._form.style.display = 'grid'), 1000);
  }

  _clearInputFields() {
    this._inputDuration.value = this._inputDistance.value = this._inputCadence.value = this._inputElevation.value =
      '';
  }

  _toggleElevationField() {
    this._inputCadence
      .closest('.form__row')
      .classList.toggle('form__row--hidden');
    this._inputElevation
      .closest('.form__row')
      .classList.toggle('form__row--hidden');
  }

  // SET DEFAULT FIELD
  _defaultElevationField() {
    if (this._inputType.value === 'running') {
      //prettier-ignore
      this._inputCadence.closest('.form__row').classList.remove('form__row--hidden');
      //prettier-ignore
      this._inputElevation.closest('.form__row').classList.add('form__row--hidden');
    }

    if (this._inputType.value === 'cycling') {
      //prettier-ignore
      this._inputCadence.closest('.form__row').classList.add('form__row--hidden');
      //prettier-ignore
      this._inputElevation.closest('.form__row').classList.remove('form__row--hidden');
    }
  }

  _renderWorkout(workout) {
    // const data = await this._getGeoCode(workout);
    // const weather = await this._showWeatherIcon(workout);
    const data = '';
    const weather = '';

    // APPLICABLE HTML FOR BOTH
    let markup = this._generateMarkup(workout, data, weather);

    // ADD HTML BASED ON TYPE
    workout.type === 'running'
      ? (markup += this._generateMarkupRunning(workout))
      : (markup += this._generateMarkupCycling(workout));

    this._form.insertAdjacentHTML('afterend', markup);
  }

  _generateMarkup(workout, data, weather) {
    return `
      <li class="workout workout__${workout.type}" data-id="${workout.id}">
          <div class="menu menu__hidden">
            <ul class="menu__list">
              <li class="menu__item menu__item--edit">
                <svg class="menu__icon">
                  <use xlink:href="${icons}#icon-pencil"></use>
                </svg>
                <span>Edit form</span>
              </li>
              <li class="menu__item menu__item--delete">
                <svg class="menu__icon">
                  <use xlink:href="${icons}#icon-trash"></use>
                </svg>
                <span>Delete this list</span>
              </li>
              <li class="menu__item menu__item--clear">
                <svg class="menu__icon">
                  <use xlink:href="${icons}#icon-trash"></use>
                </svg>
                <span>Clear all lists</span>
              </li>
              <li class="menu__item menu__item--sort">
                <svg class="menu__icon">
                  <use xlink:href="${icons}#icon-chevron-down"></use>
                </svg>
                <span>Sort by</span><span class="menu__sort--text">(km, date)</span>
              </li>
            </ul>
          </div>

          <h2 class="workout__title">${setDescription(workout)}${
      data ? ',' : ''
    }
          ${data ?? ''} <img class="workout__weather" src="${weather}"/>

          </h2>
          <svg class="workout__icon">
            <use xlink:href="${icons}#icon-dots-three-horizontal"></use>
          </svg>
          <div class="workout__details">
            <span class="workout__imoji workout__imoji--type">${
              workout.type === 'running' ? '🏃‍♂' : '🚴‍♀️'
            }</span>
            <span class="workout__value workout__value--distance">${
              workout.distance
            }</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__imoji">⏱</span>
            <span class="workout__value workout__value--duration">${
              workout.duration
            }</span>
            <span class="workout__unit">min</span>
          </div>
    `;
  }

  _generateMarkupRunning(workout) {
    return `
          <div class="workout__details">
            <span class="workout__imoji">⚡️</span>
            <span class="workout__value workout__value--pace">${workout.pace.toFixed(
              1
            )}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__imoji">🦶🏼</span>
            <span class="workout__value workout__value--cadence">${
              workout.cadence
            }</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
      `;
  }

  _generateMarkupCycling(workout) {
    return `
          <div class="workout__details">
            <span class="workout__imoji">⚡️</span>
            <span class="workout__value workout__value--speed">${workout.speed.toFixed(
              1
            )}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__imoji">⛰</span>
            <span class="workout__value workout__value--elevation">${
              workout.elevationGain
            }</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
      `;
  }
}

export default new WorkoutListsView();
