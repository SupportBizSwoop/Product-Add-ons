<?php

namespace ZAddons;

class Admin
{
	public function __construct()
	{
		new Admin\ListGroup();
		new Admin\SingleGroup();
		new Admin\Layout();
	}

    public static function getUrl( $tab ) {
			return add_query_arg([
				'post_type' => 'product',
				'page' => 'za_groups',
				'tab' => $tab,
			], admin_url('edit.php'));
		}
}
