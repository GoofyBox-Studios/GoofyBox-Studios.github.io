const utils = {
	deleteAllChildren: function (element) {
		while (element.children.length > 0) {
			element.removeChild(element.children[0]);
		}
	}
};