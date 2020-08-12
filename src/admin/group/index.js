import "app/path.js";

import React from "react";
import ReactDOM from "react-dom";
import Form from "./Form.jsx";

window.renderGroup = ({ data, categories: allCategories }, elem) => {
	ReactDOM.render(<Form {...data} allCategories={allCategories} />, elem);
};
