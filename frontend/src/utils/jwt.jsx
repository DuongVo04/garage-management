export const decodeToken = (token) => {
	try {
		// console.log(token);
		const payload = token.split(".")[1];
		return JSON.parse(atob(payload));
	} catch {
		return null;
	}
};