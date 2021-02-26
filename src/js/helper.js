export const AJAX = async function (url, errMsg) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) throw new Error(errMsg);

    return data;
  } catch (err) {
    throw err;
  }
};

// VALIDATION HELPER FUNCTION
export const isNumber = (...inputs) =>
  inputs.every((input) => Number.isFinite(input));
export const isPositive = (...inputs) => inputs.every((input) => input > 0);

// DESCRIPTION FROM DATE AND TYPE OF WORKOUT
export const setDescription = function (workout) {
  if (workout.type === 'running')
    return `${workout.type.replace(
      workout.type[0],
      workout.type[0].toUpperCase()
    )} on ${workout.dateDescription}`;

  if (workout.type === 'cycling')
    return `${workout.type.replace(
      workout.type[0],
      workout.type[0].toUpperCase()
    )} on ${workout.dateDescription}`;
};

export const findWorkout = function (workouts, workoutEl) {
  const workout = workouts.find((work) => work.id === workoutEl.dataset.id);

  return workout;
};

export const findWorkoutPopup = function (workouts, popup) {
  // leaflet-popup running-popup 3201455437 leaflet-zoom-animated
  const workout = workouts.find(
    (work) =>
      `leaflet-popup ${work.type}-popup ${work.id} leaflet-zoom-animated` ===
      popup.className
  );

  return workout;
};
