import { NgComponentOutlet } from '@angular/common';
import { Component, input, Type } from '@angular/core';

@Component({
  selector: 'app-button-signals',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './button.component.html',
  styleUrl: '../shared/button.component.css',
})
export class ButtonSignalsComponent {
  leftIcon = input<Type<any> | null>(null);
  rightIcon = input<Type<any> | null>(null);
}
