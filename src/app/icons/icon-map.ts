import { Type } from '@angular/core';
import { ArrowLeftIconComponent } from './arrow-left-icon.component';
import { ArrowRightIconComponent } from './arrow-right-icon.component';
import { ChevronLeftIconComponent } from './chevron-left-icon.component';
import { ChevronRightIconComponent } from './chevron-right-icon.component';

export const ICON_MAP: Record<string, Type<any> | null> = {
  none: null,
  arrowLeft: ArrowLeftIconComponent,
  arrowRight: ArrowRightIconComponent,
  chevronLeft: ChevronLeftIconComponent,
  chevronRight: ChevronRightIconComponent,
};

export type IconKey = keyof typeof ICON_MAP;
