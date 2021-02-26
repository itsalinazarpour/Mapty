import 'core-js/stable';
// // FOR ASYNC POLIFILLING ASYNC FUNCTION
import 'regenerator-runtime/runtime';
import 'leaflet';

import icons from 'url:../../svg/sprite.svg';
import logoIcon from 'url:../../img/icon.png';

import View from './View.js';
import { findPopupByClassName, findMarkerByClassName } from '../helper.js';

class SubmenuView extends View {
  _parentEl = document.querySelector('.side-bar');

  constructor() {
    super();
    this._addHandlerRender();
    this._addHandlerHideMenu();
  }

  // CLICK ON THREE DOTS ICON RENDER POP-UP MENU
  _addHandlerRender() {
    this._parentEl.addEventListener('click', function (e) {
      if (e.target.tagName !== 'svg' && e.target.tagName !== 'use') return;
      const menu = e.target.closest('.workout').querySelector('.menu');

      // FOR SLIGHT ANIMATION
      menu.style.display = 'block';
      setTimeout(() => menu.classList.remove('menu__hidden'), 10);
    });
  }

  _addHandlerHideMenu() {
    //prettier-ignore
    this._parentEl.addEventListener('click', this._hideMenuClickOnOutside.bind(this));
  }

  addHandlerControlMenu(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const menuItem = e.target.closest('.menu__item');
      const workoutEl = e.target.closest('.workout');

      handler(workoutEl, menuItem);
    });
  }

  _controlMenu(e) {
    // CLICK ON DELETE BUTTON, DELETE THE WORKOUT
    if (menuItem.classList.contains('menu__item--delete'))
      this._deleteWorkout(e);

    // CLICK ON CLEAR BUTTON, CLEAR ALL
    if (menuItem.classList.contains('menu__item--clear'))
      this._clearLocalStorage();

    // CLICK ON SORT BUTTON, SORT LISTS BY DISTANCE
    if (menuItem.classList.contains('menu__item--sort')) {
      this._sortWorkout(this._selectedWorkout);
    }

    this._closeMenu();
  }

  // DELETE LIST FROM LOCAL STORAGE, WORKOUT ARRAY AND RELOAD PAGE
  deleteWorkout(workout, workoutEl) {
    // [...BLAH] = ARRAY.FROM(BLAH)  CONVERTING DOM TO ARR
    const popups = [...document.querySelectorAll('.leaflet-popup')];
    const markers = [...document.querySelectorAll('.leaflet-marker-icon')];

    const popup = findPopupByClassName(popups, workout);
    const marker = findMarkerByClassName(markers, workout);

    // DELETE POPUP, MARKER AND WORKOUT FROM LIST (TRICK)
    popup.style.display = 'none';
    marker.style.display = 'none';
    workoutEl.style.display = 'none';
  }

  hideMenu() {
    const menus = this._parentEl.querySelectorAll('.menu');

    menus.forEach((menu) => {
      if (menu.classList.contains('menu__hidden')) return;
      menu.classList.add('menu__hidden');
      menu.style.display = 'none';
    });
  }

  // CLICK ON OUTSIDE OF MENU, HIDE MENU ONLY WHEN MENU IS SHOWED
  _hideMenuClickOnOutside(e) {
    const menus = Array.from(this._parentEl.querySelectorAll('.menu'));
    // prettier-ignore
    const isHidden = menus.every((menu) => menu.classList.contains('menu__hidden'));

    if (e.target.closest('.menu__item') !== null || isHidden) return;

    this.hideMenu();
  }
}

export default new SubmenuView();
