<?php foreach ($type->values as $value) {
    if ($value->hide) {
        continue;
    }?>
	<div class="zaddon_checkbox zaddon_option">
		<label>
			<input
				type="checkbox"
				<?= $value->checked ? "checked" : "" ?>
				name="<?= $name ?>[value][]"
				value="<?= $value->getID() ?>"
				data-price="<?= $value->price ?>"
				data-type="<?= $type->type ?>"
			/>
			<?= $value->title ?>
			<?= $value->price ? '(' . wc_price($value->price) . ')' : "" ?>
				<?= !$value->hide_description ? '<p class="zaddon-option-description">' . $value->description . '</p>': "" ?>
		</label>
			<?php do_action('zaddon_after_option_input', $value, $name); ?>
	</div>
<?php } ?>
