import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectComponent } from './effect.component';
const routes: Routes = [
  { path: '', component: EffectComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EffectRoutingModule { }
