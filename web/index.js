// Styles
import 'normalize.css';
import './styles/main.scss';

import domReady from 'domready';

import app from './app';

window.app = app;
domReady(app.init.bind(app));

