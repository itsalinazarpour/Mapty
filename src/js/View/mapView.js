import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'leaflet';

import logoIcon from 'url:../../img/icon.png';
import View from './View.js';
import workoutListsView from './workoutListsView.js';

// prettier-ignore
import { MAP_ZOOM_LEVEL, ICON_SIZE, ICON_ANCHOR, POPUP_ANCHOR, POPUP_MAX_WIDTH, POPUP_MIN_WIDTH, POPUP_AUTO_CLOSE, POPUP_CLOSE_ON_CLICK, MAP_PADDING, PAN_DURATION_SEC, ANIMATE} from './../config.js';
import { setDescription } from '../helper.js';

class MapView extends View {
  _map = document.querySelector('.map');
  _mapZoomLevel = MAP_ZOOM_LEVEL;

  _errMsg =
    'Fail to load your position. </br>Please allow location access of this site to access your location🗺';
  _inputDistance = document.querySelector('.form__input--distance');

  addHandlerSetViewToPopup(handler) {
    this._map.addEventListener('click', function (e) {
      const popup = e.target.closest('.leaflet-popup');
      if (!popup) return;

      handler(popup);
    });
  }

  // LOAD MAP FROM LEAFLET LIBRARY, SHOW MARKERS FROM LOCAL STORAGE || SHOW FORM BY CLICKING
  loadMap(position, workouts, handler) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this._map = L.map('map').setView(coords, this._mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    // SHOW FORM BY CLICKING ON MAP
    this.addHandlerClick(workoutListsView.showForm.bind(workoutListsView));

    // IF LOCAL STORAGE IS EMPTY RETURN IMMEDIATELY
    if (workouts.length === 0) return;

    // RENDER MARKER AFTER LOADING A MAP
    workouts.forEach((work) => this.renderWorkoutMarker(work));

    // ZOOM TO FIT ALL WORKOUT MARKERS
    this.setZoomAndFit(workouts);
  }

  addHandlerClick(handler) {
    this._map.on('click', handler);
  }

  renderWorkoutMarker(workout) {
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

  setZoomAndFit(workouts) {
    if (workouts.length === 1) return this.setViewToPopup(workouts[0]);

    const allCoords = workouts.map((workout) => workout.coords);
    this._map.fitBounds(allCoords, { padding: MAP_PADDING });
  }

  setViewToPopup(workout) {
    this._map.setView(workout.coords, this._mapZoomLevel, {
      animate: ANIMATE,
      pan: {
        duration: PAN_DURATION_SEC,
      },
    });
  }
}

export default new MapView();
