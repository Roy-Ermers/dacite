import type { InjectionKey } from "vue";
import type Scope from "@dacite/ecs";

export const ScopeInjectionKey = Symbol("scope") as InjectionKey<Scope>
