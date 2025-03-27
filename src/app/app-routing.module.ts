import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'users-list', pathMatch: 'full' }, // Redirect root path to users-list
  { path: 'effect', loadChildren: () => import('./effect/effect.module').then(m => m.EffectModule) },
  { path: 'users-list', loadChildren: () => import('./users-list/users-list.module').then(m => m.UsersListModule) },
  { path: '**', redirectTo: 'users-list' } // Catch-all route to redirect invalid paths to users-list
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
