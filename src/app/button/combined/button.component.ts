import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, input, Type } from '@angular/core';
import { BUTTON_LEFT_ICON, BUTTON_RIGHT_ICON } from '../shared/button.tokens';

@Component({
  selector: 'app-button-combined',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './button.component.html',
  styleUrl: '../shared/button.component.css',
})
export class ButtonCombinedComponent {
  // undefined = input not bound (fall back to DI)
  // null     = explicitly "no icon" (overrides DI)
  // Type<any> = use this component
  readonly leftIconInput = input<Type<any> | null | undefined>(undefined, { alias: 'leftIcon' });
  readonly rightIconInput = input<Type<any> | null | undefined>(undefined, { alias: 'rightIcon' });

  private readonly diLeft = inject(BUTTON_LEFT_ICON, { optional: true });
  private readonly diRight = inject(BUTTON_RIGHT_ICON, { optional: true });

  readonly resolvedLeftIcon = computed(() => {
    const inp = this.leftIconInput();
    return inp !== undefined ? inp : (this.diLeft ?? null);
  });

  readonly resolvedRightIcon = computed(() => {
    const inp = this.rightIconInput();
    return inp !== undefined ? inp : (this.diRight ?? null);
  });
}
