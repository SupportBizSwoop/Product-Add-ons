import React, { Component, Fragment } from "react";
import throttle from "lodash/throttle";
import Popover from "app/components/Popover";

import styles from "./styles.pcss";

export default class Selector extends Component {
	state = {
		currentValues: [],
		open: false,
		purposeValues: [],
		search: "",
		loading: false,
	};

	constructor(props) {
		super(props);

		this.state.currentValues = this.props.children;

		this.onSearch = throttle(this.onSearch.bind(this), 500);
		this.setSearch = this.setSearch.bind(this);
		this.showValues = this.showValues.bind(this);
		this.addValue = this.addValue.bind(this);
		this.removeValue = this.removeValue.bind(this);
	}

	addValue(value) {
		if (this.state.currentValues.map(p => p.id).includes(value.id)) return;
		this.props.addChanges();
		this.setState(prevState => ({
			currentValues: [...prevState.currentValues, value],
			search: "",
		}));
	}

	removeValue(id) {
		this.props.addChanges();
		this.setState(prevState => ({
			currentValues: [...prevState.currentValues].filter(product => product.id !== id),
		}));
	}

	setSearch(search) {
		this.setState({ search });
	}

	showValues() {
		this.onSearch();
		this.setState({ open: true });
	}

	onSearch(search = "") {
		if (search.length < this.props.limit) return;

		this.setState({ loading: true });
		this.props
			.onSearch(search)
			.then(purposeValues => this.setState({ purposeValues, open: true, loading: false }));
	}

	render() {
		return (
			<tr>
				<th>{this.props.label}</th>
				<td>
					<Popover
						visible={this.state.open}
						onRequestClose={() => this.setState({ open: false })}
						content={
							<div className={styles.selector}>
								{this.state.purposeValues.length > 0 ? (
									<SelectorList addValue={this.addValue} name={this.props.name}>
										{this.state.purposeValues}
									</SelectorList>
								) : (
									<div className={styles.empty}>
										{this.state.loading
											? wp.i18n.__('Loading', 'product-add-ons-woocommerce')
											: this.state.search.length < this.props.limit
												? wp.i18n.sprintf(wp.i18n._x('Please enter %s or more characters', 'Limit of characters', 'product-add-ons-woocommerce'), this.props.limit)
												: wp.i18n.__('Nothing found', 'product-add-ons-woocommerce')}
									</div>
								)}
							</div>
						}
					>
						<div className={styles.list}>
							{this.state.currentValues.map(data => (
								<div className={styles.chip} key={`list-${this.props.name}${data.id}`}>
									<input type="hidden" name={`${this.props.name}[]`} value={data.id} />
									{data.name}
									<button
										onClick={event => {
											event.preventDefault();
											this.removeValue(data.id);
										}}
									>
										<span className="dashicons dashicons-no-alt" />
									</button>
								</div>
							))}

							<input
								type="text"
								placeholder={this.props.placeholder}
								value={this.state.search}
								onFocus={this.showValues}
								onChange={event => {
									this.onSearch(event.target.value);
									this.setSearch(event.target.value);
								}}
							/>
						</div>
					</Popover>
				</td>
			</tr>
		);
	}
}


class SelectorList extends Component {
	static defaultProps = {
		deep: 0,
	};

	render() {
		const { children, name, addValue, deep } = this.props;
		return children.map(value => (
			<Fragment key={`menu-${name}${value.id}-${deep}`}>
				<button onClick={() => addValue(value)}>
					{" - ".repeat(deep)}
					{value.name}
				</button>
				{value.child && (
					<SelectorList addValue={addValue} name={name} deep={deep + 1}>
						{value.child}
					</SelectorList>
				)}
			</Fragment>
		));
	}
}
