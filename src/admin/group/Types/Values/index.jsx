import React, { Component, Fragment } from "react";

import styles from "./styles.pcss";

export default class Values extends Component {
	render() {
		const { children: items, add, edit, remove, formName, applyTo } = this.props;
		return (
			<table className={"wp-list-table widefat fixed"}>
				{items.map(el => (
					<Value
						formName={`${formName}[${el.uniq}]`}
						remove={remove.bind(null, el.uniq)}
						edit={edit.bind(null, el.uniq)}
						key={el.uniq}
            applyTo={applyTo}
					>
						{el}
					</Value>
				))}
				{items.length > 0 ? <Heading add={add} /> : <Heading add={add} empty />}
			</table>
		);
	}
}

class Heading extends Component {
	render() {
		const { empty, add } = this.props;
		return (
			<thead className={styles.heading}>
				<tr>
					{empty ? (
						<td colSpan={4}>
							<button onClick={add} className={`button button-primary ${styles.addFullOption}`}>
                  {wp.i18n.__('Add option', 'product-add-ons-woocommerce')}
							</button>
						</td>
					) : (
						<Fragment>
							<td>{wp.i18n.__('Label', 'product-add-ons-woocommerce')}</td>
							<td>{wp.i18n.__('Price', 'product-add-ons-woocommerce')}</td>
							<td className={styles.checkbox}>{wp.i18n.__('Checked', 'product-add-ons-woocommerce')}</td>
							<td className={styles.checkbox}>{wp.i18n.__('Hide', 'product-add-ons-woocommerce')}</td>
							<td>
								<button onClick={add} className={"button"}>
                    {wp.i18n.__('Add', 'product-add-ons-woocommerce')}
								</button>
							</td>
						</Fragment>
					)}
				</tr>
			</thead>
		);
	}
}

class Value extends Component {
	onBlurPrice = event => {
		const { edit: editRaw } = this.props;
		const edit = editRaw();
		const inputValue = parseFloat(event.target.value || 0);
		const value = (Number.isNaN(inputValue) ? 0 : inputValue).toFixed(2);
		edit(value, "price");
	};

	render() {
		const {
			formName,
			edit: editRaw,
			remove,
        applyTo,
			children: {
				id,
				title,
				price,
				description,
				checked,
				hide_description: hideDescription,
				hide,
				step,
				uniq,
          tax_status: taxStatus,
          tax_class: taxClass,
          multiple_quantity: multipleQuantity,
			},
		} = this.props;

		const edit = editRaw();

		const renderTaxes = ['cart', 'checkout', 'cart_checkout'].includes(applyTo);

		return (
			<tbody className={styles.row}>
				<tr>
					<td>
						{id && <input type="hidden" name={`${formName}[id]`} defaultValue={id} />}
						<input type="hidden" name={`${formName}[step]`} defaultValue={step} />
						<input
							type="text"
							required
							name={`${formName}[title]`}
							value={title}
							onChange={event => edit(event.target.value, "title")}
						/>
					</td>
					<td>
						<input
							value={price}
							onBlur={this.onBlurPrice}
							name={`${formName}[price]`}
							onChange={event => edit(event.target.value, "price")}
						/>
					</td>
					<td className={styles.checkbox}>
						<input
							type="checkbox"
							checked={checked}
							value={1}
							name={`${formName}[checked]`}
							onChange={event => edit(!checked, "checked")}
						/>
					</td>
					<td className={styles.checkbox}>
						<input
							type="checkbox"
							checked={hide}
							value={1}
							name={`${formName}[hide]`}
							onChange={event => edit(!hide, "hide")}
						/>
					</td>
					<td>
						<button onClick={remove()} className={"button button-link-delete"}>
                {wp.i18n.__('Delete', 'product-add-ons-woocommerce')}
						</button>
					</td>
				</tr>
				<tr>
					<td id={styles.descriptionCheckboxContainer}>
						<input
							id={`hide-description${uniq}`}
							type="checkbox"
							checked={hideDescription}
							value={1}
							name={`${formName}[hide_description]`}
							onChange={event => edit(!hideDescription, "hide_description")}
						/>
						<label htmlFor={`hide-description${uniq}`}>{wp.i18n.__('Hide description from display', 'product-add-ons-woocommerce')}</label>
					</td>
				</tr>
				<tr>
					<td colSpan={2}>
						<textarea
							className={styles.area}
							placeholder={wp.i18n.__('Description', 'product-add-ons-woocommerce')}
							name={`${formName}[description]`}
							value={description}
							onChange={event => edit(event.target.value, "description")}
						/>
					</td>
				</tr>
      <tr>
          {renderTaxes && (
              <td className={styles.leftAlign}>
                  <label>{wp.i18n.__('Taxes', 'product-add-ons-woocommerce')}</label>
                  <br/>
                  <select
                      name={`${formName}[tax_status]`}
                      onChange={event => edit(event.target.value, 'tax_status')}
                      value={taxStatus}
                  >
                      <option value="none">{wp.i18n._x('None', 'Tax status', 'product-add-ons-woocommerce')}</option>
                      <option value="taxable">{wp.i18n.__('Taxable', 'product-add-ons-woocommerce')}</option>
                  </select>
                  <select
                      name={`${formName}[tax_class]`}
                      onChange={event => edit(event.target.value, 'tax_class')}
                      value={taxClass}
                  >
                      <option value="">{wp.i18n._x('Standard', 'Tax class', 'product-add-ons-woocommerce')}</option>
                      {window.ZAddons.taxSlugs.map(slug => {
                          const taxClass = slug.replace('-', ' ').replace(/^\w/, c => c.toUpperCase());
                          return <option value={slug}>{taxClass}</option>
                      })}
                  </select>
              </td>
          )}
          <td className={styles.leftAlign}>
              {window.ZAddons.isCustomizeAddOnActive && (
                  <React.Fragment>
                      <label>{wp.i18n.__('Allow Multiple Quantity', 'product-add-ons-woocommerce')}</label>
                      <br/>
                      <select
                          name={`${formName}[multiple_quantity]`}
                          onChange={event => edit(event.target.value, 'multiple_quantity')}
                          value={multipleQuantity}
                      >
                          <option value="disabled">{wp.i18n.__('Disabled', 'product-add-ons-woocommerce')}</option>
                          <option value="enabled">{wp.i18n.__('Enabled', 'product-add-ons-woocommerce')}</option>
                      </select>
                  </React.Fragment>
              )}
          </td>
      </tr>
			</tbody>
		);
	}
}
