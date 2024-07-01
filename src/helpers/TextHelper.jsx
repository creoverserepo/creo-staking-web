const currFormat = (value) => {
	return new Intl.NumberFormat("en-US").format(value);
};
export const addressShort = (address) => {
	return address.slice(0, 6) + "..." + address.slice(-4);
};
export const nowTime = () => {
	return parseInt(new Date().getTime() / 1000);
};
export const cacheTime = () => {
	return parseInt(new Date().getTime() / 1000 + 300);
};
export const epochFormat = (value) => {
	return new Date(value * 1000).toUTCString().slice(0, -7) + " UTC";
};
export const numFormat = (value = 0, decimal = 0) => {
	const divider = Math.pow(10, decimal);
	return value / divider;
};
export const lblFormat = (value = 0, decimal = 0, ticker = "") => {
	const num = numFormat(value, decimal);
	return currFormat(num) + ticker;
};
export const copyAddress = (address) => {
	navigator.clipboard.writeText(address).then(() => {
		alert("Copied!");
	});
};
export const maturityDate = (days) => {
	const currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + days);
	const options = { year: "numeric", month: "short", day: "numeric" };
	const futureDateStr = currentDate.toLocaleDateString("en-US", options);
	return futureDateStr;
};

export const formatNumber = (amount, decimalPlace = 2, symbol = "") => {
	if (Number(amount) === 0) return "0";
	let index = String(amount).indexOf(".");
	if (index === -1) amount = Number(amount).toFixed(2);
	let roundAmount = amount.toString().replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	let rindex = roundAmount.indexOf(".");
	let hasDecimal = decimalPlace !== 0 ? 1 : 0;
	return roundAmount.slice(0, rindex + hasDecimal + decimalPlace) + symbol;
};
