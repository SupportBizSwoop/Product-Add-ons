import "app/path.js";

import React from "react";
import ReactDOM from "react-dom";
import App from './App';

window.renderGroups = (data, elem) => {
	ReactDOM.render(
		<App {...data} />,
		elem,
	);
};
