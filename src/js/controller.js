import 'core-js/stable';
// // FOR ASYNC POLIFILLING ASYNC FUNCTION
import 'regenerator-runtime/runtime';
import 'leaflet';

import icons from 'url:../svg/sprite.svg';
import logoIcon from 'url:../img/icon.png';
import * as model from './model.js';
import mapView from './View/mapView.js';

// GET POSITION FROM GEO API
const getPosition = function () {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      mapView.loadMap.bind(mapView),
      () => mapView.renderError().bind(mapView)
    );
};

const init = function () {
  getPosition();
};

init();
