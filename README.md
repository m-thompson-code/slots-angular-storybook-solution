# Angular + Storybook: Dynamic Component Slots

Three patterns for building Angular components with **configurable icon slots** that integrate with Storybook controls — without relying on `<ng-content>`.

## Why Not `<ng-content>`?

`<ng-content>` works great for app composition, but Storybook cannot project content into slots via `args`. Slots need to be **data-driven** — passing component *types* as configuration rather than rendering component *instances* directly.

---

## The Three Patterns

### 1. Input Signals — `ButtonSignalsComponent`

Icon slots are passed as [`input()`](https://angular.dev/api/core/input) signals — component class references that the template renders dynamically via [`NgComponentOutlet`](https://angular.dev/api/common/NgComponentOutlet). The parent controls which icon to display via a normal template binding `[leftIcon]="..."`, and changes propagate immediately through Angular's signal graph with no `OnPush` boilerplate required.

**Best for:** per-instance configuration where different buttons on a page can show different icons, and Storybook stories driven by `args`.

### 2. Dependency Injection — `ButtonDiComponent`

Icon slots are configured via Angular's DI system using [`InjectionToken`](https://angular.dev/api/core/InjectionToken)s (`BUTTON_LEFT_ICON`, `BUTTON_RIGHT_ICON`). The component calls `inject()` once at construction, making this pattern ideal for **static, environment-level defaults** — feature flags, design-system theming by product, lazy-loaded feature modules with a distinct icon set, or test and Storybook isolation via `moduleMetadata`.

**Limitation:** because `inject()` runs once at construction, the resolved icon cannot change while the component instance is alive. Use the Input Signals or Combined approach for runtime toggling.

### 3. Combined — `ButtonCombinedComponent`

Merges both techniques: DI provides an environment-level default and `input()` lets individual callers override it per-instance. A `computed()` signal resolves the final value using a three-state sentinel:

- `undefined` (input not bound) → fall back to the DI token
- `null` (explicitly bound to null) → show nothing, even if DI has a value
- `Type<any>` → use this component, ignoring DI

**Best for:** shared component libraries where some consumers need per-instance overrides while others rely on environment-level defaults.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run Storybook
npm run storybook
```
