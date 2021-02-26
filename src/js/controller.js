import 'core-js/stable';
// // FOR ASYNC POLIFILLING ASYNC FUNCTION
import 'regenerator-runtime/runtime';
import 'leaflet';

import * as model from './model.js';
import mapView from './View/mapView.js';
import workoutListsView from './View/workoutListsView.js';
import submenuView from './View/submenuView.js';

import { findWorkout, findWorkoutPopup } from './helper.js';

// GET POSITION FROM GEO API AND CONTROL MAP
const controlMap = function () {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      (position) => mapView.loadMap(position, model.state.workouts),
      () => mapView.renderError().bind(mapView)
    );
};

const controlWorkout = function () {
  if (!model.state.edit) {
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
  if (model.state.edit) {
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

// CLICK ON LIST, SET VIEW TO CORRESPONDING POPUP
const controlSetViewToList = function (workoutEl) {
  const workout = findWorkout(model.state.workouts, workoutEl);

  mapView.setViewToPopup(workout);
};

// CLICK ON POP-UP CONTENT ON MAP, SET VIEW TO THE CORRESPONDING POP-UP
const controlSetViewToPopup = function (popup) {
  const workout = findWorkoutPopup(model.state.workouts, popup);

  mapView.setViewToPopup(workout);
};

const controlWorkoutMenu = function (workoutEl, menuItem) {
  if (menuItem === null) return; // Guard clause
  const workout = findWorkout(model.state.workouts, workoutEl);

  if (menuItem.classList.contains('menu__item--edit')) {
    workoutListsView.showEditForm(workout);
    workoutListsView.defaultElevationField();
    model.state.edit = true;

    // if (model.state.edit) {
    //   this._map.on('click', this._showBrandNewForm.bind(this));
    // }
  }
  // CLICK ON DELETE BUTTON, DELETE THE WORKOUT
  if (menuItem.classList.contains('menu__item--delete')) {
    submenuView.deleteWorkout(workout, workoutEl);
    // console.log(workoutEl);
    // console.log(workout);

    model.state.workouts = model.state.workouts.filter(
      (work) => work.id !== workout.id
    );
    model.setLocalStorage(model.state.workouts);
    mapView.setZoomAndFit(model.state.workouts);
  }

  // // CLICK ON CLEAR BUTTON, CLEAR ALL
  // if (menuItem.classList.contains('menu__item--clear'))
  //   if (menuItem.classList.contains('menu__item--sort'))
  //     // CLICK ON SORT BUTTON, SORT LISTS BY DISTANCE
  submenuView.hideMenu();
};

const init = function () {
  controlMap();
  model.getLocalStorage();
  loadWorkouts(model.state.workouts);
  workoutListsView.addHandlerForm(controlWorkout);
  workoutListsView.addHandlerSetViewToList(controlSetViewToList);
  mapView.addHandlerSetViewToPopup(controlSetViewToPopup);
  submenuView.addHandlerControlMenu(controlWorkoutMenu);
};

init();
