import 'core-js/stable';
// // FOR ASYNC POLIFILLING ASYNC FUNCTION
import 'regenerator-runtime/runtime';
import 'leaflet';

import icons from 'url:../../svg/sprite.svg';
import logoIcon from 'url:../../img/icon.png';
import View from './View.js';
import workoutListsView from './workoutListsView.js';

// prettier-ignore
import { MAP_ZOOM_LEVEL, ICON_SIZE, ICON_ANCHOR, POPUP_ANCHOR, POPUP_MAX_WIDTH, POPUP_MIN_WIDTH, POPUP_AUTO_CLOSE, POPUP_CLOSE_ON_CLICK } from './../config.js';
import { setDescription } from '../helper.js';

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
    this._map.on('click', workoutListsView.showForm.bind(workoutListsView));

    // // RENDER MARKER AFTER LOADING A MAP
    // this._workouts.forEach((work) => this._renderWorkoutMarker(work));

    // // ZOOM TO FIT ALL WORKOUT MARKERS
    // if (this._workouts.length === [].length) return;

    // const allCoords = this._workouts.map((workout) => workout.coords);
    // this._map.fitBounds(allCoords, { padding: [150, 150] });
  }

  renderWorkoutMarker(workouts) {
    const workout = workouts[workouts.length - 1];

    const myIcon = L.icon({
      iconUrl: logoIcon,
      iconSize: ICON_SIZE,
      iconAnchor: ICON_ANCHOR,
      popupAnchor: POPUP_ANCHOR,
      className: `${workout.id}`,
    });

    L.marker(workout.coords, { icon: myIcon })
      .addTo(this._map)
      .bindPopup(
        L.popup({
          maxWidth: POPUP_MAX_WIDTH,
          minWidth: POPUP_MIN_WIDTH,
          autoClose: POPUP_AUTO_CLOSE,
          closeOnClick: POPUP_CLOSE_ON_CLICK,
          className: `${workout.type}-popup ${workout.id}`,
        })
      )
      .setPopupContent(setDescription(workout))
      .openPopup();
  }
}

export default new MapView();
