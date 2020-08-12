<?php

namespace ZAddons;

use ZAddons\Model\Addon;

class Addons
{
		const DEFAULT_HEADER_TEXT = "Checkout Add-ons";
		const CHECKOUT_ADDON_NAMESPACE = "ZProductAddons";
		const CUSTOMIZE_ADDON_NAMESPACE = "ZAddonsCustomize";
		const PRODUCT_RESTRICTION_ADDON_NAMESPACE = "zProductRestriction";

		public function __construct()
		{
				add_action('wp_ajax_zaddon_save_header_text', [$this, 'save_header_text']);
		}

		public static function is_active_add_on( $namespace )
		{
				$name = "\\{$namespace}\\ACTIVE";
				return defined($name) && constant($name);
		}

		public function save_header_text()
		{
				global $wpdb;
				echo json_encode($_GET);
				$header_text_cart = $_GET['header_cart_text'] ? str_replace('\\', '', $_GET['header_cart_text'] ) : self::DEFAULT_HEADER_TEXT;
				$header_text_checkout = $_GET['header_checkout_text'] ? str_replace('\\', '', $_GET['header_checkout_text'] ) : self::DEFAULT_HEADER_TEXT;
				$table_name = $wpdb->prefix . DB::Prefix . DB::Headers;
				$wpdb->query("TRUNCATE TABLE ${table_name}");
				$wpdb->query(
					$wpdb->prepare(
						"INSERT INTO ${table_name}
                (header_text, header_type)
                 VALUES 
                 (%s, 'cart'),
                 (%s, 'checkout')
                 ", $header_text_cart, $header_text_checkout)
				);
				exit;
		}

		public static function get_header_text_of($type = 'cart')
		{
				global $wpdb;
				$prefix = $wpdb->prefix . DB::Prefix;
				$headers_table = $prefix . DB::Headers;
				$result = $wpdb->get_var(
					$wpdb->prepare(
						"SELECT header_text FROM ${headers_table} 
                    WHERE header_type = %s
                    ORDER BY id DESC LIMIT 1
                    ", $type)

				);
				return $result ? $result : self::DEFAULT_HEADER_TEXT;
		}

		public static function get_all_add_ons() {
				return [
					new Addon(
						__('Product Add-ons Plus', 'product-add-ons-woocommerce'),
						__('Add advanced functionality for Product Add-ons to enable more features', 'product-add-ons-woocommerce'),
						self::CUSTOMIZE_ADDON_NAMESPACE,
						'https://www.bizswoop.com/wp/productaddons/plus'
					),
					new Addon(
						__('Product Checkout Add-Ons', 'product-add-ons-woocommerce'),
						__('Add Customized Product Checkout Add-Ons for WooCommerce', 'product-add-ons-woocommerce'),
						self::CHECKOUT_ADDON_NAMESPACE,
						'https://www.bizswoop.com/wp/productaddons/checkout'
					),
					new Addon(
						__('Product & Order Restrictions', 'product-add-ons-woocommerce'),
						__('Easily setup checkout product restrictions and order frequency restrictions', 'product-add-ons-woocommerce'),
						self::PRODUCT_RESTRICTION_ADDON_NAMESPACE,
						'https://www.bizswoop.com/wp/productaddons/restrictions'
					),
					new Addon(
						__('Product Samples', 'product-add-ons-woocommerce'),
						__('Easily add product samples features and functionality for products', 'product-add-ons-woocommerce'),
						'',
						'https://www.bizswoop.com/wp/productaddons/samples'
					),
				];
		}

}
