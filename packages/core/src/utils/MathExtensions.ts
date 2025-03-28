export default {
	fraction(value: number): number {
		return value - Math.floor(value);
	},

	safeFloor(value: number): number {
		return value | 0;
	}
};
