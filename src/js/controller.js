import 'core-js/stable';
// // FOR ASYNC POLIFILLING ASYNC FUNCTION
import 'regenerator-runtime/runtime';
import 'leaflet';

import icons from 'url:../svg/sprite.svg';
import logoIcon from 'url:../img/icon.png';

import * as model from './model.js';
import mapView from './View/mapView.js';
import workoutListsView from './View/workoutListsView.js';

// GET POSITION FROM GEO API
const getPosition = function () {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      mapView.loadMap.bind(mapView),
      () => mapView.renderError().bind(mapView)
    );
};

const controlWorkout = function (edit = false) {
  if (!edit) {
    // RENDER NEW WORKOUT
    workoutListsView.newWorkout(
      model.Running,
      model.Cycling,
      model.state.workouts
    );

    // RENDER WORKOUT ON MAP AS A MARKER
    mapView.renderWorkoutMarker(model.state.workouts);

    // // SET WORKOUT TO LOCAL STORAGE
    // model.setLocalStorage(model.state.workouts);
  }
  if (edit) {
    workoutListsView.editWorkout(this._selectedWorkout);
  }
};

const init = function () {
  getPosition();
  workoutListsView.addHandlerForm(controlWorkout);
};

init();
