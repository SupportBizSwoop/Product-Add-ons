<?php
$format = $type->type;
$type_template = __DIR__ . '/type-' . $format . '.php';
if ($type->status === 'disable') {
    return ;
} ?>
	<div class="zaddon-type-container <?= $type->accordion === 'close' && $format !== 'select' ? 'zaddon_closed' : ''?>" data-id="<?= $type->getID() ?>">
    <h3><?= $type->title ?>  <?=  $format !== 'select' ? '<button class="zaddon-open" />' : ''?></h3>
	<?php
    if (!$type->hide_description && $type->description) {
        $classes[] = $type->display_description_on_expansion ? 'zaddon_hide_on_toggle' : '';
        if ($type->accordion === 'close') {
						$classes[] = 'zaddon_hide';
				}
        echo '<p class="' . esc_attr( join( ' ', (array) $classes ) ) . '">' . $type->description . '<p>';
    }
    $name = 'zaddon[' . $group->getID() . '][' . $type->getID() . ']';
	$template = __DIR__ . '/' . $format . '.php';
	if (file_exists($template)) {
		include $template;
	} ?>
	<input type="hidden" name="<?= $name ?>[type]" value="<?= $format ?>">
</div>

