import 'core-js/stable';
// // FOR ASYNC POLIFILLING ASYNC FUNCTION
import 'regenerator-runtime/runtime';
import 'leaflet';

// import icons from 'url:../svg/sprite.svg';
// import logoIcon from 'url:../img/icon.png';
import View from './View.js';

class WorkoutListsView extends View {
  _parentEl = document.querySelector('.map');
  _errMsg = `⚠️ Characters or Symbols and Negative Numbers are NOT allowed for inputs.⚠️ <br />Only Positive Numbers are permitted unless elevation field. <br />
    On elevation input, Negative number is good to put!😄`;

  addHandlerRender() {}

  addHandlerUpdate() {}

  _clear() {}
}

export default new WorkoutListsView();
