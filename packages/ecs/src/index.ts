import Scope from "./Scope";

export { default as System } from "./systems/System";
export { default as EntitySystem } from "./systems/EntitySystem";
export { default as Entity } from "./entities/Entity";
export { default as Query, type InferQuerySet } from "./queries/Query";
export { default as ComponentSet } from "./components/ComponentSet";
export { default as ComponentSymbols } from "./components/ComponentSymbols";
export default Scope;
