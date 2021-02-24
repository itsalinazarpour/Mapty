import 'core-js/stable';
// // FOR ASYNC POLIFILLING ASYNC FUNCTION
import 'regenerator-runtime/runtime';
import 'leaflet';

// import icons from 'url:../svg/sprite.svg';
// import logoIcon from 'url:../img/icon.png';
import View from './View.js';
import { isNumber, isPositive } from '../helper.js';

class WorkoutListsView extends View {
  _parentEl = document.querySelector('.map');
  _errMsg = `⚠️ Characters or Symbols and Negative Numbers are NOT allowed for inputs.⚠️ <br />Only Positive Numbers are permitted unless elevation field. <br />
    On elevation input, Negative number is good to put!😄`;
  _mapEvent;
  _editChecker = false;

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
    this._addHandlerSubmit();
  }

  _addHandlerSelect() {
    // prettier-ignore
    this._inputType.addEventListener('change', this._toggleElevationField.bind(this));
  }

  _addHandlerSubmit() {
    this._form.addEventListener('submit', this._controlWokrout.bind(this));
  }

  _controlWokrout(e) {
    e.preventDefault();

    if (!this._editChecker) {
      this._newWorkout();
    }
    if (this._editChecker) {
      this._editWorkout(this._selectedWorkout);
      this._editChecker = false;
    }
  }

  addHandlerRender() {}

  addHandlerUpdate() {}

  _clear() {}

  _showForm(mapE) {
    this._form.classList.remove('hidden');
    this._clearInputFields();
    this._inputDistance.focus();

    // mapE = EVENT TO GET LOCATION FROM LEAFLET MAP
    this._mapEvent = mapE;
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

  _newWorkout() {
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

      workout = new model.Running([lat, lng], distance, duration, cadence);
    }

    // IF WORKOUT IS CYCLING, CREATE CYCLING OBJECT
    if (type === 'cycling') {
      // CHECK IF DATA IS VALID
      if (
        !isNumber(duration, distance, elevation) ||
        !isPositive(duration, distance)
      )
        return this.renderError();

      workout = new model.Cycling([lat, lng], distance, duration, elevation);
    }

    // ADD NEW OBJECT TO WORKOUTS ARRAY
    this._workouts.push(workout);

    // RENDER WORKOUT ON MAP AS A MARKER
    this._renderWorkoutMarker(workout);

    // RENDER WORKOUT ON LIST
    this._renderWorkout(workout);

    // HIDE FORM + clear input fields
    this._hideForm();
    // SET WORKOUT TO LOCAL STORAGE
    console.log(this._workouts);
    model.setLocalStorage(this._workouts);
  }
}

export default new WorkoutListsView();
