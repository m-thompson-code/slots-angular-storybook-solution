import { Component, Input, Type } from '@angular/core';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { ButtonCombinedComponent } from './button.component';
import { BUTTON_LEFT_ICON, BUTTON_RIGHT_ICON } from '../shared/button.tokens';
import { ArrowLeftIconComponent } from '../../icons/arrow-left-icon.component';
import { ArrowRightIconComponent } from '../../icons/arrow-right-icon.component';
import { ChevronLeftIconComponent } from '../../icons/chevron-left-icon.component';
import { ChevronRightIconComponent } from '../../icons/chevron-right-icon.component';
import { ICON_MAP } from '../../icons/icon-map';

// ─── Wrapper: Interactive (input-driven) ─────────────────────────────────────

@Component({
  selector: 'storybook-combined-wrapper',
  standalone: true,
  imports: [ButtonCombinedComponent],
  template: `<app-button-combined [leftIcon]="leftIcon" [rightIcon]="rightIcon">Click me</app-button-combined>`,
})
class CombinedInteractiveWrapperComponent {
  leftIcon: Type<any> | null = ICON_MAP['arrowLeft'];
  rightIcon: Type<any> | null = ICON_MAP['arrowRight'];

  @Input() set leftIconKey(key: string) { this.leftIcon = ICON_MAP[key] ?? null; }
  @Input() set rightIconKey(key: string) { this.rightIcon = ICON_MAP[key] ?? null; }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Button/3 - Combined',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ButtonCombinedComponent] })],
  render: () => ({
    template: `<app-button-combined>Click me</app-button-combined>`,
  }),
  parameters: {
    docs: { description: { component: COMPONENT_DESCRIPTION() } },
  },
};

export default meta;
type Story = StoryObj;

// ─── No config ────────────────────────────────────────────────────────────────

export const NoConfig: Story = {
  name: 'No Config (no input, no DI)',
};

// ─── DI only ─────────────────────────────────────────────────────────────────
//
// No bindings passed. The component falls back to the two DI tokens.

export const DIOnly: Story = {
  name: 'DI Only (no input)',
  decorators: [
    moduleMetadata({
      providers: [
        { provide: BUTTON_LEFT_ICON, useValue: ChevronLeftIconComponent },
        { provide: BUTTON_RIGHT_ICON, useValue: ChevronRightIconComponent },
      ],
    }),
  ],
};

// ─── Input only ───────────────────────────────────────────────────────────────
//
// [leftIcon] and [rightIcon] passed directly. No DI provider.
// computed() returns the input values without touching the DI tree.

export const InputOnly: Story = {
  name: 'Input Only (no DI)',
  render: () => ({
    props: { leftIcon: ArrowLeftIconComponent, rightIcon: ArrowRightIconComponent },
    template: `<app-button-combined [leftIcon]="leftIcon" [rightIcon]="rightIcon">Click me</app-button-combined>`,
  }),
};

// ─── Input overrides DI ───────────────────────────────────────────────────────
//
// DI provides chevrons; inputs provide arrows.
// computed(() => inp !== undefined ? inp : diToken?.()) picks the inputs.

export const InputOverridesDI: Story = {
  name: 'Input Overrides DI',
  decorators: [
    moduleMetadata({
      providers: [
        { provide: BUTTON_LEFT_ICON, useValue: ChevronLeftIconComponent },
        { provide: BUTTON_RIGHT_ICON, useValue: ChevronRightIconComponent },
      ],
    }),
  ],
  render: () => ({
    props: { leftIcon: ArrowLeftIconComponent, rightIcon: ArrowRightIconComponent },
    template: `<app-button-combined [leftIcon]="leftIcon" [rightIcon]="rightIcon">Click me (arrows win)</app-button-combined>`,
  }),
};

// ─── Interactive Controls ─────────────────────────────────────────────────────

export const Interactive: Story = {
  name: 'Interactive Controls',
  decorators: [moduleMetadata({ imports: [CombinedInteractiveWrapperComponent] })],
  render: (args) => ({
    props: args,
    template: `<storybook-combined-wrapper
      [leftIconKey]="leftIcon"
      [rightIconKey]="rightIcon"
    ></storybook-combined-wrapper>`,
  }),
  argTypes: {
    leftIcon: { control: 'select', options: Object.keys(ICON_MAP) },
    rightIcon: { control: 'select', options: Object.keys(ICON_MAP) },
  },
  args: {
    leftIcon: 'arrowLeft',
    rightIcon: 'arrowRight',
  },
};

// ─── Docs description ────────────────────────────────────────────────────────
// Scroll past the stories to find this. It renders in the Storybook Docs tab.
// Defined as a function so it can live below meta without a ReferenceError.

function COMPONENT_DESCRIPTION() { return `
## Combining Input Signals with DI Defaults

This approach merges both techniques: DI provides an environment-level default,
and [\`input()\`](https://angular.dev/api/core/input) lets a caller override it per-instance. A [\`computed()\`](https://angular.dev/api/core/computed) signal
resolves the final value at render time.

### How the resolution works

The input is typed as \`Type<any> | null | undefined\`:

- \`undefined\` — the input was not bound by the caller → fall back to the DI token
- \`null\` — the caller explicitly opted out → show nothing, even if DI has a value
- \`Type<any>\` — the caller provided a component → use it, ignoring DI

\`\`\`ts
readonly leftIconInput = input<Type<any> | null | undefined>(undefined, { alias: 'leftIcon' });
private readonly diLeft = inject(BUTTON_LEFT_ICON, { optional: true });

readonly resolvedLeftIcon = computed(() => {
  const inp = this.leftIconInput();
  return inp !== undefined ? inp : (this.diLeft ?? null);
});
\`\`\`

### When to combine both approaches

Use the combined pattern when a component lives in a shared library and needs
to satisfy two different consumers at once:

**Consumer A — uses the component without configuration**
They get the icon defined by their app's DI providers automatically. No
per-usage boilerplate needed.

**Consumer B — has a specific instance that needs a different icon**
They pass \`[leftIcon]="MyCustomIcon"\` on that one usage. DI is ignored for
that instance; everything else in the app still uses the DI default.

**Consumer C — wants no icon on a specific instance**
They pass \`[leftIcon]="null"\` to explicitly suppress the DI default.

### When not to use it

- If no consumer ever needs per-instance overrides, plain DI is simpler.
- If no consumer needs environment-level defaults, plain \`input()\` is simpler.
- The \`undefined\` sentinel adds a third state to the input type — document it
  clearly so callers understand the difference between passing \`null\` and not
  binding the input at all.
`.trim(); }
