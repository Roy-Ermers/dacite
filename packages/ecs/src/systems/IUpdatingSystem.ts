export default interface IUpdatingSystem {
	update(): void;
	priority: number | undefined;
}
