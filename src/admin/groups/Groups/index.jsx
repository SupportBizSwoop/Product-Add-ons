import React, { Fragment, Component } from "react";
import classNames from "classnames";

import styles from "./styles.pcss";
import { hot } from "react-hot-loader";
import axios from 'app/basic/axios';

@hot(module)
export default class Groups extends Component {
	render() {
		return this.props.children.map(group => <Group removeGroup={this.props.removeGroup} {...group} key={group.id} />);
	}
}

class Group extends Component {

    handleDelete = async () => {
        const message = wp.i18n.__(
            '!Important the action of deleting a Product Add-on can’t be undone. All Product Add-on data and information will be deleted.',
            'product-add-ons-woocommerce',
        );
        if (confirm(message)) {
            const { id } = this.props;
            const { data } = await axios.delete(`/groups/${id}`);
            if (data.success) {
                this.props.removeGroup(id)
            }
        }
    }

	render() {
		const { link, title, priority, products, categories, apply_to } = this.props;

		const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

		const applyToLabel = apply_to === 'cart_checkout' ? 'Cart & Checkout' : capitalize(apply_to);
		return (
			<tr className="no-items">
				<td>
					<span className="dashicons dashicons-exerpt-view" style={{ margin: "5px 5px 0px 0px" }} />
					<strong>
						<a href={link} className="row-title">
							{title}
						</a>
					</strong>
				</td>
				<td style={{ textAlign: "center" }}>
					<span>{wp.i18n.__(applyToLabel, 'product-add-ons-woocommerce')}</span>
				</td>
				{apply_to === "custom" ? (
					<Fragment>
						{categories.length === 0 && products.length === 0 ? (
							<td colSpan={2}>
								<p className={classNames(styles.empty, styles.full)}>{wp.i18n.__('Empty', 'product-add-ons-woocommerce')}</p>
							</td>
						) : (
							<Fragment>
								<td>
									<ul className={styles.list}>
										<Links>{products}</Links>
									</ul>
								</td>
								<td>
									<ul className={styles.list}>
										<Links>{categories}</Links>
									</ul>
								</td>
							</Fragment>
						)}
					</Fragment>
				) : (
					<td colSpan={2}>
						<p className={classNames(styles.all, styles.full)}>{wp.i18n.__(applyToLabel, 'product-add-ons-woocommerce')}</p>
					</td>
				)}
				<td className={styles.priority}>{priority}</td>
				<td className={styles.info}>
					{apply_to === "custom" &&
						categories.length === 0 &&
						products.length === 0 && <div className={styles.error}>{wp.i18n.__('Needs Review', 'product-add-ons-woocommerce')}</div>}
				</td>
				<td className={styles.actions}>
					<a href={link} className={`button ${styles.editButton}`}>
              {wp.i18n.__('Edit', 'product-add-ons-woocommerce')}
					</a>
            <button onClick={this.handleDelete} className="button">
                {wp.i18n.__('Delete', 'product-add-ons-woocommerce')}
            </button>
				</td>
			</tr>
		);
	}
}

@hot(module)
export class AddOnsBlock extends Component {
	state = {
		headerTextCart: window.ZAddons.headerTextCart || '',
		headerTextCheckout: window.ZAddons.headerTextCheckout || '',
	};

	handleChangeCartText(event) {
		this.setState({headerTextCart: event.target.value})
	}

	handleChangeCheckoutText(event) {
		this.setState({headerTextCheckout: event.target.value})
	}

	handleBlur(event) {
		fetch(`${window.ZAddons.SITE_URL}/wp-admin/admin-ajax.php?action=zaddon_save_header_text&header_cart_text=${this.state.headerTextCart}&header_checkout_text=${this.state.headerTextCheckout}`)
			.catch((error) => {
				console.error(error);
			});
	}

	render() {
		const { headerTextCart, headerTextCheckout } = this.state;
		return (
			<Fragment>
			{window.ZAddons.isCheckoutAddOnActive && (
				<Fragment>
					<h2 style={{ marginBottom: '0'}}>{wp.i18n.__('Checkout & Cart Add-ons', 'product-add-ons-woocommerce')}</h2>
					<tr>
						<td>
							<h5	style={{fontSize: '1.2em'}}>{wp.i18n.__('Container Header Text - Cart', 'product-add-ons-woocommerce')}</h5>
						</td>
						<td>
							<input
								type="text"
								id="header-text-cart"
								name="header_text_cart"
								className="header-text"
								value={headerTextCart}
								onChange={this.handleChangeCartText.bind(this)}
								onBlur={this.handleBlur.bind(this)}
							/>
						</td>
						<td>
							<span className="groups-description">{wp.i18n.__('Customize cart add-ons header text', 'product-add-ons-woocommerce')}</span>
						</td>

					</tr>
					<tr>
						<td>
							<h5	style={{fontSize: '1.2em'}}>{wp.i18n.__('Container Header Text - Checkout', 'product-add-ons-woocommerce')}</h5>
						</td>
						<td>
							<input
								type="text"
								id="header-text-checkout"
								name="header_text_checkout"
								className="header-text"
								value={headerTextCheckout}
								onChange={this.handleChangeCheckoutText.bind(this)}
								onBlur={this.handleBlur.bind(this)}
							/>
						</td>
						<td>
							<span className="groups-description">{wp.i18n.__('Customize checkout add-ons header text', 'product-add-ons-woocommerce')}</span>
						</td>
					</tr>
				</Fragment>
			)}
			</Fragment>
		);
	}
}

class Links extends Component {
	render() {
		return this.props.children.length > 0 ? (
			this.props.children.map(el => (
				<li key={el.link}>
					<a href={el.link}>{el.name}</a>
				</li>
			))
		) : (
			<div className={styles.empty}>&mdash;</div>
		);
	}
}

@hot(module)
export class Heading extends Component {
	render() {
		return (
			<tr>
				<th style={{ width: "200px" }}>{wp.i18n.__('Title', 'product-add-ons-woocommerce')}</th>
				<th style={{ width: "100px" }}>{wp.i18n.__('Apply to', 'product-add-ons-woocommerce')}</th>
				<th>{wp.i18n.__('Products', 'product-add-ons-woocommerce')}</th>
				<th>{wp.i18n.__('Categories', 'product-add-ons-woocommerce')}</th>
				<th style={{ width: "48px" }}>{wp.i18n.__('Priority', 'product-add-ons-woocommerce')}</th>
				<th>&nbsp;</th>
				<th style={{ width: "60px", textAlign: "right" }}>{wp.i18n.__('Actions', 'product-add-ons-woocommerce')}</th>
			</tr>
		);
	}
}
