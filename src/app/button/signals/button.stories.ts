import { Component, Input, Type } from '@angular/core';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { ButtonSignalsComponent } from './button.component';
import { ArrowLeftIconComponent } from '../../icons/arrow-left-icon.component';
import { ArrowRightIconComponent } from '../../icons/arrow-right-icon.component';
import { ChevronLeftIconComponent } from '../../icons/chevron-left-icon.component';
import { ChevronRightIconComponent } from '../../icons/chevron-right-icon.component';
import { ICON_MAP } from '../../icons/icon-map';

// ─── Wrapper: Interactive Controls ───────────────────────────────────────────
//
// Maps string keys from Storybook controls to component types and passes them
// as separate [leftIcon] / [rightIcon] bindings. When the property changes,
// Angular's template binding re-passes the new reference to the input signal.

@Component({
  selector: 'storybook-signals-wrapper',
  standalone: true,
  imports: [ButtonSignalsComponent],
  template: `<app-button-signals [leftIcon]="leftIcon" [rightIcon]="rightIcon">Click me</app-button-signals>`,
})
class SignalsInteractiveWrapperComponent {
  leftIcon: Type<any> | null = ICON_MAP['arrowLeft'];
  rightIcon: Type<any> | null = ICON_MAP['arrowRight'];

  @Input() set leftIconKey(key: string) { this.leftIcon = ICON_MAP[key] ?? null; }
  @Input() set rightIconKey(key: string) { this.rightIcon = ICON_MAP[key] ?? null; }
}

// ─── Wrapper: Toggle ─────────────────────────────────────────────────────────
//
// Replaces property references on toggle. Because the template uses direct
// bindings ([leftIcon]="leftIcon"), Angular re-evaluates the input signal on
// every change detection cycle — no live-reference tricks needed.

@Component({
  selector: 'storybook-signals-toggle-wrapper',
  standalone: true,
  imports: [ButtonSignalsComponent],
  template: `
    <div style="display:flex; flex-direction:column; gap:1rem; align-items:flex-start;">
      <app-button-signals [leftIcon]="leftIcon" [rightIcon]="rightIcon">Click me</app-button-signals>
      <button (click)="toggle()">Toggle Icons</button>
    </div>
  `,
})
class SignalsToggleWrapperComponent {
  leftIcon: Type<any> | null = ArrowLeftIconComponent;
  rightIcon: Type<any> | null = ArrowRightIconComponent;

  toggle(): void {
    this.leftIcon = this.leftIcon === ArrowLeftIconComponent ? ChevronLeftIconComponent : ArrowLeftIconComponent;
    this.rightIcon = this.rightIcon === ArrowRightIconComponent ? ChevronRightIconComponent : ArrowRightIconComponent;
  }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Button/1 - Input Signals',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ButtonSignalsComponent] })],
  render: () => ({
    template: `<app-button-signals>Click me</app-button-signals>`,
  }),
  parameters: {
    docs: { description: { component: COMPONENT_DESCRIPTION() } },
  },
};

export default meta;
type Story = StoryObj;

// ─── Static Stories ───────────────────────────────────────────────────────────

export const NoIcons: Story = {
  name: 'No Icons',
};

export const WithArrows: Story = {
  name: 'With Arrows',
  render: () => ({
    props: { leftIcon: ArrowLeftIconComponent, rightIcon: ArrowRightIconComponent },
    template: `<app-button-signals [leftIcon]="leftIcon" [rightIcon]="rightIcon">Click me</app-button-signals>`,
  }),
};

export const WithChevrons: Story = {
  name: 'With Chevrons',
  render: () => ({
    props: { leftIcon: ChevronLeftIconComponent, rightIcon: ChevronRightIconComponent },
    template: `<app-button-signals [leftIcon]="leftIcon" [rightIcon]="rightIcon">Click me</app-button-signals>`,
  }),
};

export const LeftIconOnly: Story = {
  name: 'Left Icon Only',
  render: () => ({
    props: { leftIcon: ArrowLeftIconComponent, rightIcon: null },
    template: `<app-button-signals [leftIcon]="leftIcon" [rightIcon]="rightIcon">Click me</app-button-signals>`,
  }),
};

// ─── Interactive Controls ─────────────────────────────────────────────────────

export const Interactive: Story = {
  name: 'Interactive Controls',
  decorators: [moduleMetadata({ imports: [SignalsInteractiveWrapperComponent] })],
  render: (args) => ({
    props: args,
    template: `<storybook-signals-wrapper
      [leftIconKey]="leftIcon"
      [rightIconKey]="rightIcon"
    ></storybook-signals-wrapper>`,
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

// ─── Toggle (User Interaction) ────────────────────────────────────────────────

export const WithToggle: Story = {
  name: 'Toggle Icons',
  decorators: [moduleMetadata({ imports: [SignalsToggleWrapperComponent] })],
  render: () => ({
    template: `<storybook-signals-toggle-wrapper></storybook-signals-toggle-wrapper>`,
  }),
};

// ─── Docs description ────────────────────────────────────────────────────────
// Scroll past the stories to find this. It renders in the Storybook Docs tab.
// Defined as a function so it can live below meta without a ReferenceError.

function COMPONENT_DESCRIPTION() { return `
## Runtime Icon Slots via Input Signals

Icon slots are passed as [\`input()\`](https://angular.dev/api/core/input) signals — plain component class references
that the template renders dynamically using [\`NgComponentOutlet\`](https://angular.dev/api/common/NgComponentOutlet).

### input()

[\`input()\`](https://angular.dev/api/core/input) declares a signal-based input. Unlike the classic \`@Input()\` decorator,
it returns a read-only signal so the value can be read reactively inside
\`computed()\`, \`effect()\`, or directly in templates:

\`\`\`ts
leftIcon = input<Type<any> | null>(null);
\`\`\`

The template calls \`leftIcon()\` to unwrap the current value. When the parent
updates the binding, Angular's signal graph propagates the change and re-renders
only the affected parts of the template — no \`OnPush\` boilerplate required.

### NgComponentOutlet

[\`NgComponentOutlet\`](https://angular.dev/api/common/NgComponentOutlet) dynamically instantiates a component class and inserts it
into the DOM at the directive's host element:

\`\`\`html
<ng-container *ngComponentOutlet="leftIcon()" />
\`\`\`

Passing \`null\` renders nothing. Passing a different class swaps the component
out on the next change detection pass. No template switching, no \`@switch\`,
no registry — just pass the class reference directly.

### Why this combination works well

- The caller decides which icon to show — the button component stays generic.
- The parent controls the value via a normal template binding \`[leftIcon]="..."\`.
- Changing the bound value at runtime (e.g. on a button click or after an API
  response) is immediately reflected because the input is a signal.
- The component has zero knowledge of the available icons — new icon components
  can be introduced without touching the button.

---

### Alternative: NgTemplateOutlet for predefined template fragments

[\`NgComponentOutlet\`](https://angular.dev/api/common/NgComponentOutlet) works well when each slot is a self-contained component.
If you already have a \`<ng-template>\` defined in the parent's template and want
to project it into the child, use [\`NgTemplateOutlet\`](https://angular.dev/api/common/NgTemplateOutlet) instead:

\`\`\`ts
// Parent passes a TemplateRef rather than a component class
leftIcon = input<TemplateRef<any> | null>(null);
\`\`\`

\`\`\`html
<!-- button template -->
<ng-container *ngTemplateOutlet="leftIcon()" />
\`\`\`

\`\`\`html
<!-- caller -->
<ng-template #myIcon><span>★</span></ng-template>
<app-button [leftIcon]="myIcon">Save</app-button>
\`\`\`

**When to prefer \`NgTemplateOutlet\`:**
- The slot content is a lightweight inline fragment, not a reusable component.
- You need to pass context variables from the host into the slot (via \`ngTemplateOutletContext\`).
- You want the slot to share the parent's change detection without creating a new component instance.

**When to prefer \`NgComponentOutlet\`:**
- The slot is a standalone component with its own logic, styles, or DI.
- The slot type is determined at runtime from a registry or token (a class reference is easier to pass around than a \`TemplateRef\`).
- You want each slot to have an isolated injector scope.
`.trim(); }

