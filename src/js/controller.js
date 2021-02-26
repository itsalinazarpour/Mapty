import 'core-js/stable';
// // FOR ASYNC POLIFILLING ASYNC FUNCTION
import 'regenerator-runtime/runtime';
import 'leaflet';

import * as model from './model.js';
import mapView from './View/mapView.js';
import workoutListsView from './View/workoutListsView.js';

import { findWorkout, findWorkoutPopup } from './helper.js';

// GET POSITION FROM GEO API AND CONTROL MAP
const controlMap = function () {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      (position) => mapView.loadMap(position, model.state.workouts),
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

    // RENDER WORKOUT ON LIST
    const workout = model.state.workouts[model.state.workouts.length - 1];

    workoutListsView.renderWorkout(
      workout,
      model.getGeoCode(workout),
      model.getWeatherData(workout)
    );

    // RENDER WORKOUT ON MAP AS A MARKER
    mapView.renderWorkoutMarker(workout);

    // SET WORKOUT TO LOCAL STORAGE
    model.setLocalStorage(model.state.workouts);
  }
  if (edit) {
    workoutListsView.editWorkout(this._selectedWorkout);
  }
};

const loadWorkouts = function (workouts) {
  if (workouts.length === 0) return;
  console.log(workouts);

  // for (const work of workouts) {
  //   workoutListsView.renderWorkout(work).bind(workoutListsView);
  // }

  workouts.forEach((workout) =>
    workoutListsView.renderWorkout(
      workout,
      model.getGeoCode(workout),
      model.getWeatherData(workout)
    )
  );
};

// CLICK ON LIST
const controlSetViewToList = function (workoutEl) {
  const workout = findWorkout(model.state.workouts, workoutEl);

  mapView.setViewToPopup(workout);
};

// CLICK ON POPUP
const controlSetViewToPopup = function (popup) {
  const workout = findWorkoutPopup(model.state.workouts, popup);

  mapView.setViewToPopup(workout);
};

const init = function () {
  controlMap();
  model.getLocalStorage();
  loadWorkouts(model.state.workouts);
  workoutListsView.addHandlerForm(controlWorkout);
  workoutListsView.addHandlerSetViewToList(controlSetViewToList);
  mapView.addHandlerSetViewToPopup(controlSetViewToPopup);
};

init();
