import { RegisterComponent } from './register/register.component'
import { LoginComponent } from './login/login.component'
import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'  }, // default route of the module
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
