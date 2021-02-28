import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'leaflet';

export default class View {
  _data;
  _textEl = document.querySelector('.error__text');
  _windowEl = document.querySelector('.error-window');
  _overlayEl = document.querySelector('.overlay');
  _btnClose = document.querySelector('.error__btn--close');

  constructor() {
    this._addHandlerHideWindow();
  }

  renderError(errMsg = this._errMsg) {
    this._textEl.innerHTML = errMsg;
    this._toggleWindow();
  }

  _toggleWindow() {
    this._windowEl.classList.toggle('hidden');
    this._overlayEl.classList.toggle('hidden');
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
    this._overlayEl.addEventListener('click', this._toggleWindow.bind(this));
  }

  _clear() {}
}
