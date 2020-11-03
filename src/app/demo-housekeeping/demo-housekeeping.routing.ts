import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import {HousekeepingComponent} from "./components/housekeeping/housekeeping.component";
import {RoomComponent} from "./components/room/room.component";

export const routes: Routes = [
  { path: '', component: HousekeepingComponent },
  { path: 'search-room', component: RoomComponent },
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
