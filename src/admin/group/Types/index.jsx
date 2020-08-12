import React, { Component } from "react";
import classNames from "classnames";
import autobind from "autobind";
import nanoid from "nanoid";
import { SortableContainer, SortableElement, arrayMove } from "react-sortable-hoc";
import Magnet, { className as MagnetName } from "app/components/Magnet";
import Values from "./Values";

import styles from "./styles.pcss";

export default class WrapTypes extends Component {
	state = { items: [] };

	componentDidMount() {
		this.setState({
			items: WrapTypes.processSteps(
				this.props.children
					.map(e => ({
						...e,
						full: false,
						uniq: nanoid(),
						values: WrapTypes.processSteps([...e.values].map(v => ({ ...v, uniq: nanoid() }))),
					}))
					.sort((a, b) => a.step - b.step),
			),
		});
	}

	onSortEnd = ({ oldIndex, newIndex }) => {
		this.props.addChanges();
		this.setState({
			items: WrapTypes.processSteps(arrayMove(this.state.items, oldIndex, newIndex)),
		});
	};

	static processSteps(array) {
		return array.map((elem, index) => ({
			...elem,
			step: index + 1,
		}));
	}

	edit = (stepUniq, valueUniq = false) => (value, name) => {
		if(name !== "full") this.props.addChanges();
		this.setState(prevState => ({
			items: [...prevState.items].map(
				el =>
					el.uniq === stepUniq
						? valueUniq
							? {
									...el,
									values: [...el.values].map(
										option => (option.uniq === valueUniq ? { ...option, [name]: value } : option),
									),
							  }
							: { ...el, [name]: value }
						: el,
			),
		}));
	};

	add = (uniqStep = false) => e => {
		e.preventDefault();
		this.props.addChanges();
		this.setState(prevState => ({
			items: WrapTypes.processSteps(
				uniqStep
					? [...prevState.items].map(
							el =>
								el.uniq === uniqStep
									? { ...el, values: WrapTypes.processSteps([...el.values, { uniq: nanoid() }]) }
									: el,
					  )
					: [...prevState.items, { full: true, uniq: nanoid(), values: [] }],
			),
		}));
	};

	remove = (uniqStep, valueUniq = false) => e => {
		e.preventDefault();
		this.props.addChanges();
		this.setState(prevState => ({
			items: WrapTypes.processSteps(
				valueUniq
					? [...prevState.items].map(
							el =>
								el.uniq === uniqStep
									? {
											...el,
											values: WrapTypes.processSteps(
												[...el.values].filter(val => val.uniq !== valueUniq),
											),
									  }
									: el,
					  )
					: [...prevState.items].filter(el => el.uniq !== uniqStep),
			),
		}));
	};

	checkDrag = e => !e.target.className.toString().includes(MagnetName);

	render() {
		return (
			<Types
				shouldCancelStart={this.checkDrag}
				onSortEnd={this.onSortEnd}
        applyTo={this.props.applyTo}
				add={this.add}
				remove={this.remove}
				edit={this.edit}
			>
				{this.state.items}
			</Types>
		);
	}
}

@SortableContainer
class Types extends Component {
	render() {
		const { children: items, add, edit, remove, applyTo } = this.props;
		return (
			<div className={styles.types}>
				<div className={styles.row}>
					<button
						onClick={add()}
						className={classNames("button button-primary", {
							[styles.fullAddRow]: items.length === 0,
						})}
					>
              {wp.i18n.__('Add row', 'product-add-ons-woocommerce')}
					</button>
				</div>
				{items.map((el, index) => (
					<Type
						key={el.uniq}
						formName={`types[${el.uniq}]`}
						add={add}
						remove={remove.bind(null, el.uniq)}
						edit={edit.bind(null, el.uniq)}
						index={index}
            applyTo={applyTo}
					>
						{el}
					</Type>
				))}
			</div>
		);
	}
}

@SortableElement
class Type extends Component {
	render() {
		const {
			formName,
			add,
        applyTo,
			edit: editRaw,
			remove: removeRaw,
			children: {
				id = null,
				title,
				step,
				uniq,
				type,
				accordion,
				status,
				values = [],
				required,
				description,
				hide_description: hideDescription,
				display_description_on_expansion: displayDescriptionOnExpansion,
				full,
			},
		} = this.props;
		const edit = editRaw();
		const remove = removeRaw();
		return (
			<div className={classNames(styles.row, styles.type)}>
				{id && <input type="hidden" name={`${formName}[id]`} value={id} />}
				<input type="hidden" name={`${formName}[step]`} value={step} />
				<div className={styles.heading}>
					<Magnet />
					<button
						onClick={e => {
							e.preventDefault();
							edit(!full, "full");
						}}
						className={styles.title}
					>
						#{step} {title}
						{type && (
							<span>
								<strong>{wp.i18n._x(type, 'One of option types', 'product-add-ons-woocommerce')} </strong>
                  {wp.i18n.sprintf(
                      wp.i18n._n(
                          'with %s option',
                          'with %s options',
                          values.length,
                          'product-add-ons-woocommerce',
                      ),
                      values.length,
              )}
							</span>
						)}
					</button>
					<button onClick={remove} className={"button button-link-delete"}>
              {wp.i18n.__('Delete', 'product-add-ons-woocommerce')}
					</button>
				</div>

				<div className={styles.form} hidden={!full}>
					<div className={styles.label}>
						<label htmlFor={`status${uniq}`}>{wp.i18n.__('Status', 'product-add-ons-woocommerce')}</label>
						<br />
						<select
							required
							id={`status${uniq}`}
							name={`${formName}[status]`}
							value={status}
							onChange={event => edit(event.target.value, "status")}
						>
                <option value="enable">{wp.i18n.__('Enable', 'product-add-ons-woocommerce')}</option>
                <option value="disable">{wp.i18n.__('Disable', 'product-add-ons-woocommerce')}</option>
						</select>
					</div>
					<div className={styles.label}>
						<label htmlFor={`addon${uniq}`}>{wp.i18n.__('Add-on', 'product-add-ons-woocommerce')}</label>
						<br />
						<select
							required
							id={`addon${uniq}`}
							name={`${formName}[type]`}
							value={type}
							onChange={event => edit(event.target.value, "type")}
						>
							<option hidden>{wp.i18n.__('Select type', 'product-add-ons-woocommerce')}</option>
							<option value="select">{wp.i18n._x('Select', 'One of option types', 'product-add-ons-woocommerce')}</option>
							<option value="radio">{wp.i18n._x('Radio', 'One of option types', 'product-add-ons-woocommerce')}</option>
							<option value="checkbox">{wp.i18n._x('Checkbox', 'One of option types', 'product-add-ons-woocommerce')}</option>
							<option value="text">{wp.i18n._x('Text', 'One of option types', 'product-add-ons-woocommerce')}</option>
						</select>
					</div>

					<div className={styles.label}>
						<label htmlFor={`accordion${uniq}`}>{wp.i18n.__('Accordion Display Style', 'product-add-ons-woocommerce')}</label>
						<br />
						<select
							required
							id={`accordion${uniq}`}
							name={`${formName}[accordion]`}
							value={accordion}
							onChange={event => edit(event.target.value, "accordion")}
						>
                <option value="open">{wp.i18n.__('Open', 'product-add-ons-woocommerce')}</option>
                <option value="close">{wp.i18n.__('Close', 'product-add-ons-woocommerce')}</option>
						</select>
					</div>

					<div className={styles.label}>
					<label htmlFor={`title${uniq}`}>{wp.i18n.__('Title', 'product-add-ons-woocommerce')}</label>
					<br />
					<input
						required
						className="regular-text"
						id={`title${uniq}`}
						name={`${formName}[title]`}
						type="text"
						value={title}
						onChange={event => edit(event.target.value, "title")}
					/>
					</div>

					<div className={classNames(styles.label, styles.line)}>
						<label htmlFor={`required${uniq}`}>{wp.i18n.__('Required', 'product-add-ons-woocommerce')}</label>
						<input
							className="regular-text"
							id={`required${uniq}`}
							type="checkbox"
							checked={required}
							value={1}
							name={`${formName}[required]`}
							onChange={event => edit(!required, "required")}
						/>
					</div>

					<div className={styles.label}>
						<label htmlFor={`description${uniq}`}>{wp.i18n.__('Description', 'product-add-ons-woocommerce')}</label>
						<br />
						<textarea
							className="regular-text"
							id={`description${uniq}`}
							value={description}
							name={`${formName}[description]`}
							onChange={event => edit(event.target.value, "description")}
						/>
						<div className={styles.descriptionCheckbox}>
							<input
								className="regular-text"
								id={`display-description-on-expansion${uniq}`}
								type="checkbox"
								checked={displayDescriptionOnExpansion}
								value={1}
								name={`${formName}[display_description_on_expansion]`}
								onChange={event => edit(!displayDescriptionOnExpansion, "display_description_on_expansion")}
							/>
							<label htmlFor={`display-description-on-expansion${uniq}`}>{wp.i18n.__('Display description only when add-on is expended open', 'product-add-ons-woocommerce')}</label>
						</div>
						<div className={styles.descriptionCheckbox}>
							<input
								className="regular-text"
								id={`hide-description${uniq}`}
								type="checkbox"
								checked={hideDescription}
								value={1}
								name={`${formName}[hide_description]`}
								onChange={event => edit(!hideDescription, "hide_description")}
							/>
							<label htmlFor={`hide-description${uniq}`}>{wp.i18n.__('Hide description from display', 'product-add-ons-woocommerce')}</label>
						</div>
					</div>
					<div className={styles.label}>
						<label>{wp.i18n.__('Options', 'product-add-ons-woocommerce')}</label>
						<br />
						<Values
							add={add(uniq)}
							formName={`${formName}[values]`}
							remove={removeRaw}
							edit={editRaw}
              applyTo={applyTo}
						>
							{values}
						</Values>
					</div>
				</div>
			</div>
		);
	}
}
