import 'core-js/stable';
// // FOR ASYNC POLIFILLING ASYNC FUNCTION
import 'regenerator-runtime/runtime';
import 'leaflet';

// import icons from 'url:../svg/sprite.svg';
// import logoIcon from 'url:../img/icon.png';
import View from './View.js';
import WorkoutListsView from './workoutListsView.js';
import { MAP_ZOOM_LEVEL } from './../config.js';
import workoutListsView from './workoutListsView.js';

class MapView extends View {
  _map = document.querySelector('.map');
  _mapZoomLevel = MAP_ZOOM_LEVEL;
  _errMsg =
    'Fail to load your position. </br>Please allow location access of this site to access your location🗺';
  _inputDistance = document.querySelector('.form__input--distance');

  addHandlerRender() {}

  addHandlerUpdate() {}

  _clear() {}

  // LOAD MAP FROM LEAFLET LIBRARY
  loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this._map = L.map('map').setView(coords, this._mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    // SHOW FORM BY CLICKING ON MAP
    this._map.on('click', workoutListsView._showForm.bind(workoutListsView));

    // // RENDER MARKER AFTER LOADING A MAP
    // this._workouts.forEach((work) => this._renderWorkoutMarker(work));

    // // ZOOM TO FIT ALL WORKOUT MARKERS
    // if (this._workouts.length === [].length) return;

    // const allCoords = this._workouts.map((workout) => workout.coords);
    // this._map.fitBounds(allCoords, { padding: [150, 150] });
  }
}

export default new MapView();
