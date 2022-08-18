import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ROUTER_CONFIGURATION } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor(private http: HttpClient) { }

  getRoomByType(room: any) {
    return this.http.get(environment.apiUrl + 'Room/getbyROomType?type=' + room);
  }

  registerCustomer(body: any) {
    return this.http.post(environment.apiUrl + 'Customer/Create', body)
  }

  bookRoom(room: any) {
    return this.http.post(environment.apiUrl + 'Booking/Create', room);
  }

  updateRoomOccupancy(body: any) {
    // console.log("body", body)
    return this.http.post(environment.apiUrl + 'Room/Update', body);
  }

  updateRoomOccupancyByRoomNo(roomNo: any) {
    // console.log("body", body)
    return this.http.post(environment.apiUrl + 'Room/UpdateRoom?roomNo=' +roomNo ,'');
  }

  createInvoice(invoice: any) {
    return this.http.post(environment.apiUrl + 'Invoice/Create', invoice);
  }

  deleteCustomerById(id: number) {
    return this.http.post(environment.apiUrl + 'Customer/delete?id=' + id, '');
  }

  getAllRoom() {
    return this.http.get(environment.apiUrl + 'Room/GetAll');
  }

  filterroom() {
    return
  }

  printInvoice(data: any) {
    return this.http.post(environment.apiUrl + 'Invoice/printInvoice', data);
  }

  getInvoice() {
    return this.http.get(environment.apiUrl + 'Invoice/GetAll');
  }

  addnewRoom(data:any){
    return this.http.post(environment.apiUrl + 'Room/Create',data);
  }

  getCustomerById(id:number){
    return this.http.get(environment.apiUrl + 'Customer/GetById?id=' +id);
  }

  getBookingById(id:number){
    return this.http.get(environment.apiUrl + 'Booking/GetById?id=' +id);
  }

  deleteRoomByroomNo(roomNo:string){
    alert(roomNo)
    return this.http.post(environment.apiUrl + 'Room/deleteByRoomNo?roomNo=' +roomNo, '');
  }
}
