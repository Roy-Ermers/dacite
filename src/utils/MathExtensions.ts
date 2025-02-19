export default class MathExtensions {
    static fraction(value: number): number {
        return value - Math.floor(value);
    }

    static safeFloor(value: number): number {
        return value | 0;
    }
}