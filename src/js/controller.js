import 'core-js/stable';
// // FOR ASYNC POLIFILLING ASYNC FUNCTION
import 'regenerator-runtime/runtime';
import 'leaflet';

import * as model from './model.js';
import mapView from './View/mapView.js';
import workoutListsView from './View/workoutListsView.js';

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

    // RENDER WORKOUT ON MAP AS A MARKER
    mapView.renderWorkoutMarker(
      model.state.workouts[model.state.workouts.length - 1]
    );

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
      model.showWeatherIcon(workout)
    )
  );
};

const init = function () {
  controlMap();
  model.getLocalStorage();
  loadWorkouts(model.state.workouts);
  workoutListsView.addHandlerForm(controlWorkout);
};

init();
