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
