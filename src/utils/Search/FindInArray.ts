function findInArray(array: any[], query: any[]): string {
	for (let q of query) {
		let search = array.includes(q)

		if (search) {
			return q
		}
	}

	return array[0]
}

export default findInArray
