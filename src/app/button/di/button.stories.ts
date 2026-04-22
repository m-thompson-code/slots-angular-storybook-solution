import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { ButtonDiComponent } from './button.component';
import { BUTTON_LEFT_ICON, BUTTON_RIGHT_ICON } from '../shared/button.tokens';
import { ArrowLeftIconComponent } from '../../icons/arrow-left-icon.component';
import { ArrowRightIconComponent } from '../../icons/arrow-right-icon.component';
import { ChevronLeftIconComponent } from '../../icons/chevron-left-icon.component';
import { ChevronRightIconComponent } from '../../icons/chevron-right-icon.component';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Button/2 - DI',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ButtonDiComponent] })],
  render: () => ({ template: `<app-button>Click me</app-button>` }),
  parameters: {
    docs: { description: { component: COMPONENT_DESCRIPTION() } },
  },
};

export default meta;
type Story = StoryObj;

// ─── Static Stories ───────────────────────────────────────────────────────────
//
// Provide plain Type<any> | null values directly via useValue.
// inject() reads the value once at component creation — perfect for static config.

export const NoIcons: Story = {
  name: 'No Icons',
};

export const WithArrows: Story = {
  name: 'With Arrows',
  decorators: [
    moduleMetadata({
      providers: [
        { provide: BUTTON_LEFT_ICON, useValue: ArrowLeftIconComponent },
        { provide: BUTTON_RIGHT_ICON, useValue: ArrowRightIconComponent },
      ],
    }),
  ],
};

export const WithChevrons: Story = {
  name: 'With Chevrons',
  decorators: [
    moduleMetadata({
      providers: [
        { provide: BUTTON_LEFT_ICON, useValue: ChevronLeftIconComponent },
        { provide: BUTTON_RIGHT_ICON, useValue: ChevronRightIconComponent },
      ],
    }),
  ],
};

export const LeftIconOnly: Story = {
  name: 'Left Icon Only',
  decorators: [
    moduleMetadata({
      providers: [
        { provide: BUTTON_LEFT_ICON, useValue: ArrowLeftIconComponent },
      ],
    }),
  ],
};

// ─── Docs description ────────────────────────────────────────────────────────
// Scroll past the stories to find this. It renders in the Storybook Docs tab.
// Defined as a function so it can live below meta without a ReferenceError.

function COMPONENT_DESCRIPTION() { return `
## Configurable Static Defaults via Dependency Injection

Icon slots are configured via [Angular's DI system](https://angular.dev/guide/di) using [\`InjectionToken\`](https://angular.dev/api/core/InjectionToken)s.
The button component calls [\`inject()\`](https://angular.dev/api/core/inject) once during construction — making DI
a natural fit for **static, environment-level defaults** rather than runtime
interactivity.

### When is this useful?

**1. Feature flags / build-time variants**
Different application providers supply different icon sets. A "premium"
build provides filled icons; a "lite" build provides outline icons — the button
component itself never changes.

**2. Design-system theming by product**
A shared component library ships a neutral default. Each consuming application
overrides the token in its root providers to match its own brand icons, without
touching the library source.

**3. Lazy-loaded feature modules with a distinct look**
A \`routes\` array wraps a route's providers with domain-specific icons:
\`{ provide: BUTTON_LEFT_ICON, useValue: DomainBackArrowComponent }\`. Every
button inside that feature automatically picks up the right icon.

**4. Testing / Storybook isolation**
Stories or \`TestBed\` configs override the token with a stub icon, keeping
tests focused on layout without coupling them to real icon implementations.

### Limitation

Because [\`inject()\`](https://angular.dev/api/core/inject) runs once at construction, the resolved component cannot
change while the instance is alive. For runtime interactivity (e.g. a toggle),
use the **Input Signals** or **Combined** approaches instead.

You can work around this by making the token carry a [\`WritableSignal\`](https://angular.dev/api/core/WritableSignal) rather than a
plain component type. The token value is still injected once, but because it is
a signal the template reacts to changes pushed into it from anywhere in the tree:

\`\`\`ts
// Token now holds a WritableSignal
export const BUTTON_LEFT_ICON =
  new InjectionToken<WritableSignal<Type<any> | null>>('BUTTON_LEFT_ICON');

// Provide a signal instance at the right scope
providers: [{
  provide: BUTTON_LEFT_ICON,
  useFactory: () => signal<Type<any> | null>(ArrowLeftIconComponent),
}]

// Component reads the signal — template stays reactive
readonly leftIcon = inject(BUTTON_LEFT_ICON, { optional: true });
// template: @if (leftIcon?.()) { <ng-container *ngComponentOutlet="leftIcon!()" /> }
\`\`\`

This keeps configuration in the DI tree while still supporting runtime updates.
The trade-off is added complexity: callers must provide a signal, not a plain
value, and the component's API becomes coupled to the signal primitive.

---

### When DI is overkill — just use defaults in the component

Most of the above use cases only justify DI when the default needs to vary
**across deployment contexts without touching the component**. If that isn't
a requirement, simpler alternatives exist:

**Default input value**
If a caller will usually pass the icon but occasionally omit it, give the
[\`input()\`](https://angular.dev/api/core/input) a default directly:
\`\`\`ts
leftIcon = input<Type<any> | null>(ArrowLeftIconComponent);
\`\`\`
No token, no provider, no DI — the component is self-contained and the caller
can still override it per-instance.

**Hardcoded fallback in the template**
If the icon is truly always the same (branding, not configuration), there is
no need for a slot at all — just reference the component directly in the template:
\`\`\`html
<app-arrow-left-icon />
<ng-content />
\`\`\`

**Use DI only when the variation is environmental, not per-instance.**
If each button on a page could show a different icon, that is per-instance
configuration and belongs on an [\`input()\`](https://angular.dev/api/core/input). If every button in a feature
module shares the same icon because of where they are in the app, that is
environmental configuration and DI is appropriate.
`.trim(); }
