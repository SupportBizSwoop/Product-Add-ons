<div class="zaddon_select zaddon_option">
	<select name="<?= $name ?>[value]" <?= $type->required ?> data-type="<?= $type->type ?>">
		<option value="" disabled selected>
				<?php echo \ZAddons\get_customize_addon_option('zac_select_drop_down_label', __('Choose an option', 'product-add-ons-woocommerce')) ?>
		</option>
		<?php foreach ($type->values as $value) {
            if ($value->hide) {
                continue;
            }?>
			<option
				value="<?= $value->getID() ?>"
				data-price="<?= $value->price ?>"
				title="<?= !$value->hide_description ? $value->description : '' ?>"
				<?php do_action('zaddon_add_select_option_property', $value); ?>
				<?= $value->checked ? "selected" : "" ?>
			>
				<?= $value->title ?>
				<?= $value->price ? '(' . wc_price($value->price) . ')' : "" ?>
			</option>
		<?php } ?>
	</select>
</div>
