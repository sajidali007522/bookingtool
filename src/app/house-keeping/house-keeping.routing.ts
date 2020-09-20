import { HouseKeepingComponent } from "./components/house-keeping/house-keeping.component";
import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import {RoomComponent} from "./components/room/room.component";


export const routes: Routes = [
  { path: '', component: HouseKeepingComponent },
  { path: 'search-room', component: RoomComponent },
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
