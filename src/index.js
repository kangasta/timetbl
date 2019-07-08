import React from 'react';
import ReactDOM from 'react-dom';

import App from './App/App';

import './index.css';

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`); // eslint-disable-line no-undef
	});
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
