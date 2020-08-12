/*global wc_enhanced_select_params */

import React, { Component, Fragment } from "react";
import autobind from "autobind";
import Selector from "./Selector";
import Types from "./Types";
import { hot } from "react-hot-loader";

@hot(module)
export default class Form extends Component {
	state = {
		changes: false,
		apply_to: this.props.apply_to || "",
	};

	@autobind
	addChanges(func = () => null) {
		return function() {
			this.setState({ changes: true });
			func.apply(null, arguments);
		}.bind(this);
	}

	@autobind
	filter(event) {
		this.addChanges()();
		this.setState({ apply_to: event.target.value });
	}

	render() {
		const {
			id = null,
			categories = [],
			products = [],
			title = "",
			priority = 0,
			types = [],
			allCategories,
			zmodal,
		} = this.props;
		const { apply_to } = this.state;

		return (
			<form method="post">
				<input type="hidden" name="zmodal" value={zmodal} />
				<input type="hidden" name="visibility" value="public" />
				{id && <input type="hidden" name="id" value={id} />}
				<table className="form-table">
					<tbody>
						<tr>
							<th>
								<label htmlFor="title">{wp.i18n.__('Group name', 'product-add-ons-woocommerce')}</label>
							</th>
							<td>
								<input
									type="text"
									id="title"
									name="title"
									onChange={this.addChanges()}
									defaultValue={title}
									className="regular-text"
								/>
							</td>
						</tr>
						<tr>
							<th>
								<label htmlFor="filter">{wp.i18n.__('Apply to', 'product-add-ons-woocommerce')}</label>
							</th>
							<td>
								<select
									name="apply_to"
									required
									value={apply_to}
									onChange={this.filter}
								>
									<option value="" disabled>{wp.i18n.__('Select criteria', 'product-add-ons-woocommerce')}</option>
									<option value="all">{wp.i18n.__('All', 'product-add-ons-woocommerce')}</option>
									<option value="custom">{wp.i18n.__('Custom', 'product-add-ons-woocommerce')}</option>
									{window.ZAddons.isCheckoutAddOnActive && (
										<Fragment>
											<option value="cart">{wp.i18n.__('Cart', 'product-add-ons-woocommerce')}</option>
											<option value="checkout">{wp.i18n.__('Checkout', 'product-add-ons-woocommerce')}</option>
											<option value="cart_checkout">{wp.i18n.__('Cart & Checkout', 'product-add-ons-woocommerce')}</option>
										</Fragment>
									)}
								</select>
							</td>
						</tr>
						{apply_to === "custom" && (
							<Fragment>
								<Selector
									label={wp.i18n.__('Products', 'product-add-ons-woocommerce')}
									name="products"
									limit={3}
									addChanges={this.addChanges()}
									onSearch={search => {
										const { ajax_url, search_products_nonce } = wc_enhanced_select_params;
										return fetch(
											`${ajax_url}?term=${search}&action=woocommerce_json_search_products_and_variations&security=${search_products_nonce}`,
											{ credentials: "include" },
										)
											.then(r => r.json())
											.then(data => Object.keys(data).map(id => ({ id, name: data[id] })));
									}}
								>
									{products}
								</Selector>
								<Selector
									label={wp.i18n.__('Categories', 'product-add-ons-woocommerce')}
									name="categories"
									limit={0}
									addChanges={this.addChanges()}
									onSearch={search => Promise.resolve(filterValues(allCategories, search))}
								>
									{categories}
								</Selector>
							</Fragment>
						)}
						<tr>
							<th>
								<label htmlFor="priority">{wp.i18n.__('Priority', 'product-add-ons-woocommerce')}</label>
							</th>
							<td>
								<input
									type="number"
									id="priority"
									name="priority"
									defaultValue={priority}
									onChange={this.addChanges()}
									className="small-text"
								/>
							</td>
						</tr>
						<tr>
							<th>
								<label htmlFor="types">{wp.i18n.__('Add-ons', 'product-add-ons-woocommerce')}</label>
							</th>
							<td>
								<Types applyTo={apply_to} addChanges={this.addChanges()}>{types}</Types>
							</td>
						</tr>
						<tr>
							<th />
							<td>
								<p className="submit">
									<input
										disabled={!this.state.changes}
										type="submit"
										name="submit"
										id="submit"
										className="button button-primary"
										defaultValue={wp.i18n.__('Save Changes', 'product-add-ons-woocommerce')}
									/>
									{id && (
										<input
											type="submit"
											style={{
												float: "right",
												backgroundColor: "#a00",
												color: "white",
												boxShadow: "0 1px 0 #600",
												borderColor: "#600",
											}}
											className="button"
											name="delete"
											value={wp.i18n.__('Delete', 'product-add-ons-woocommerce')}
										/>
									)}
								</p>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		);
	}
}

const filterValues = (values, searchValue) => {
	const search = searchValue.toLowerCase();
	return JSON.parse(JSON.stringify(values))
		.map(value => {
			if (searchValue.length === 0) return value;
			value.child = filterValues(value.child, search);
			if (value.child.length === 0 && !value.name.toLowerCase().includes(search)) return null;
			return value;
		})
		.filter(Boolean);
};
