import { InjectionToken, Type } from '@angular/core';

export const BUTTON_LEFT_ICON =
  new InjectionToken<Type<any> | null>('BUTTON_LEFT_ICON');

export const BUTTON_RIGHT_ICON =
  new InjectionToken<Type<any> | null>('BUTTON_RIGHT_ICON');
