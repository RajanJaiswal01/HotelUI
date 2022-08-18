import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelComponent } from './hotel/hotel.component';
import { RoomUpsertComponent } from './room-upsert/room-upsert.component';

const routes: Routes = [
  { path: '', component: HotelComponent },
  { path: 'admin', component: RoomUpsertComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
