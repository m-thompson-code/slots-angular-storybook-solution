import { NgComponentOutlet } from '@angular/common';
import { Component, inject, Type } from '@angular/core';
import { BUTTON_LEFT_ICON, BUTTON_RIGHT_ICON } from '../shared/button.tokens';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './button.component.html',
  styleUrl: '../shared/button.component.css',
})
export class ButtonDiComponent {
  readonly leftIcon = inject<Type<any> | null>(BUTTON_LEFT_ICON, { optional: true });
  readonly rightIcon = inject<Type<any> | null>(BUTTON_RIGHT_ICON, { optional: true });
}
