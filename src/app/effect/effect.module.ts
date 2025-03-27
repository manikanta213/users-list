import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectRoutingModule } from './effect-routing.module';
import { EffectComponent } from './effect.component';


@NgModule({
  declarations: [
    EffectComponent
  ],
  imports: [
    CommonModule,
    EffectRoutingModule
  ]
})
export class EffectModule { }
