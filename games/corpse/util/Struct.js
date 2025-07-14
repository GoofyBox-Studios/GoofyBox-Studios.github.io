function Struct(...keys) {
	return function (...values) {
		let defaultValues = null;

		const result = keys.reduce((obj, key, index) => {
			const type = typeof key;

			if (type == "string") obj[key] = values[index];
			if (type == "object") defaultValues = key;

			return obj;
		}, {});

		if (defaultValues) {
			for (let key in defaultValues) {
				result[key] = result[key] ?? defaultValues[key];
			}
		}

		return result;
	};
}
