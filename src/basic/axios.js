import axios from 'axios';

export default axios.create({
	baseURL: window.ZAddons.WC_REST,
		headers: {
			'X-WP-Nonce': window.ZAddons.WC_NONCE,
		},
});
