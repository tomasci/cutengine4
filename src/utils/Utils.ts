class Utils {
	public static isEmpty(value) {
		return (
			(typeof value == "string" && !value.trim()) ||
			typeof value == "undefined" ||
			value === null
		)
	}
}

export default Utils
