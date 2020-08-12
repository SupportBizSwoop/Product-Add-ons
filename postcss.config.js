let plugins = {
	"postcss-apply": {},
	"postcss-import": {},
	"postcss-cssnext": {},
};
if (process.env.NODE_ENV === "production") {
	plugins["postcss-flexbugs-fixes"] = {};
	plugins["cssnano"] = {};
}
module.exports = {
	plugins
};
