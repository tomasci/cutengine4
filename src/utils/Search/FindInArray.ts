function findInArray<T>(array: T[], query: T[]): T {
	for (const q of query) {
		const search = array.includes(q)

		if (search) {
			return q
		}
	}

	return array[0]
}

export default findInArray
