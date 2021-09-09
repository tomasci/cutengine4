class Utils {
	public static isEmpty<T>(value: T): boolean {
		return (
			(typeof value == "string" && !value.trim()) ||
			typeof value == "undefined" ||
			value === null
		)
	}
}

export default Utils
