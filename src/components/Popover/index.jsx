import React, { Component, Fragment } from "react";
import { createPortal } from "react-dom";

import styles from "./styles.pcss";

export default class Popover extends Component {
	state = { elem: null, portal: null };

	componentDidMount() {
		const portal = document.createElement("div");
		this.setState({ portal });
		document.body.appendChild(portal);
	}

	componentWillUnmount() {
		this.state.portal.remove();
		this.setState({ portal: null });
	}

	render() {
		const { visible, content } = this.props;
		return (
			<Fragment>
				{React.cloneElement(this.props.children, {
					ref: elem => {
						if (this.state.elem === null) this.setState({ elem });
					},
				})}
				{this.state.portal &&
					createPortal(
						this.state.elem &&
							visible && (
								<Fragment>
									<div className={styles.overlay} onClick={this.props.onRequestClose} />
									<div
										className={styles.popover}
										style={{
											left: this.state.elem.getBoundingClientRect().left,
											top: this.state.elem.getBoundingClientRect().bottom,
											width: this.state.elem.getBoundingClientRect().width,
										}}
									>
										{content}
									</div>
								</Fragment>
							),
						this.state.portal,
					)}
			</Fragment>
		);
	}
}
