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

    // RENDER WORKOUT ON MAP AS A MARKER AND SET WORKOUT TO LOCAL STORAGE
    mapView.renderWorkoutMarker(workout);
    model.setLocalStorage(model.state.workouts);
  }

  if (model.state.edit) {
    // prettier-ignore
    const workout = findWorkout(model.state.workouts, model.state.workoutElement);

    // EDIT WORKOUT AND SET THE EDITED WORKOUT TO LOCAL STORAGE
    workoutListsView.editWorkout(workout);
    model.setLocalStorage(model.state.workouts);

    // DELETE WORKOUT LISTS, POPUP AND RERENDER WORKOUT LISTS, POPUP WITH EDITED DATA
    submenuView.deleteAllWorkouts();
    model.state.edit = false;
    mapView.setZoomAndFit(model.state.workouts);
    model.state.workouts.forEach((work) => mapView.renderWorkoutMarker(work));
    loadWorkouts(model.state.workouts);
  }
};

const loadWorkouts = async function (workouts) {
  if (workouts.length === 0) return;

  // RENDER WORKOUT LISTS ASYNCRONIZELY
  for (const workout of workouts) {
    await workoutListsView.renderWorkout(
      workout,
      model.getGeoCode(workout),
      model.getWeatherData(workout)
    );
  }
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

const controlEdit = function () {
  workoutListsView.showForm.bind(workoutListsView);
  model.state.edit = false;
};

const controlWorkoutMenu = function (workoutEl, menuItem) {
  if (menuItem === null) return; // Guard clause
  const workout = findWorkout(model.state.workouts, workoutEl);
  model.state.workoutElement = workoutEl;

  // CLICK ON EDIT BUTTON
  if (menuItem.classList.contains('menu__item--edit')) {
    workoutListsView.showEditForm(workout);
    workoutListsView.defaultElevationField();
    model.state.edit = true;

    // OPEN NEW FORM, WHEN EDIT FORM IS OPENED
    mapView.addHandlerClick(controlEdit);
  }

  // CLICK ON DELETE BUTTON, DELETE THE WORKOUT
  if (menuItem.classList.contains('menu__item--delete')) {
    submenuView.deleteWorkout(workout, workoutEl);

    // DELETE LIST FROM WORKOUT ARRAY AND LOCAL STORAGE
    model.state.workouts = model.state.workouts.filter(
      (work) => work.id !== workout.id
    );
    model.setLocalStorage(model.state.workouts);
    mapView.setZoomAndFit(model.state.workouts);
  }

  // // CLICK ON CLEAR BUTTON, DELETE ALL WORKOUTS FROM THE LIST, MAP AND STORAGE
  if (menuItem.classList.contains('menu__item--clear')) {
    submenuView.deleteAllWorkouts();
    mapView.setZoomAndFit(model.state.workouts);
    model.state.workouts = [];
    model.setLocalStorage(model.state.workouts);
  }

  // CLICK ON SORT BUTTON,
  if (menuItem.classList.contains('menu__item--sort')) {
    // HIDE WORKOUT LISTS AND SORT LISTS BY DISTANCE AND CLICK AGAIN BY TIME
    submenuView.sortWorkout(model.state.workouts, model.state.sort);
    model.state.sort = !model.state.sort;

    // MANIPULATING WORKOUTS DATA AND SET VIEW AND RERENDER WORKOUTS
    model.setLocalStorage(model.state.workouts);
    mapView.setZoomAndFit(model.state.workouts);
    loadWorkouts(model.state.workouts);
  }

  submenuView.hideMenu();
};

// model.clearLocalStorage();

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
