import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelService } from '../Service/hotel.service'
import { booking, customer, customerWithInvoice, Invoice } from '../interface/interface';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit {
  ACRooms: any;
  invoice: any;
  rooms: any;
  NonACRooms: any;
  DeluxeRoom: any;
  istrue: boolean = true;
  formValue: any;
  booking: [] = [];
  invoicedata: any;
  data: any;
  checkedIndates: any;
  checkedOutdates: any;
  CustomerId: any;
  ishidden: boolean = false;
  bookId: any;
  todayDate: Date = new Date();
  profileForm: FormGroup;
  isdiscard: boolean = true;
  Name: any;
  Age: any;
  Gender: any;
  Phone: any;
  Address: any;
  isprinted: boolean = true;
  isRegistered:boolean = false;
  customerName:any;
  customerDetails:any;
  bookingData:any;
  invoiceId:any;

  imgUrl = environment.imgUrl;


  constructor(private HotelService: HotelService, fb: FormBuilder, private toastr: ToastrService) {
    this.profileForm = fb.group({
      name: ['', Validators.required],
      age: [, Validators.required],
      phoneNumber: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      checkedIndate: ['', Validators.required],
      checkedOutdate: ['', Validators.required],
      citizenship: ['Nepali']
    });
  }

  ngOnInit(): void {
    this.loadForm();
    setInterval(this.filterRoom, 1000 * 60 * 60);
    this.customerName = localStorage.getItem("customerName")?.split(' ')[0].toLocaleUpperCase();
    // console.log(this.customerName)
    if(this.customerName != undefined ){
      this.isRegistered = true;
      this.ishidden = false;
      this.istrue = false;
    }
  
    this.CustomerId = Number(localStorage.getItem("customerId"));
  }

  filterRoom() {

    var hour = new Date().getHours();
    if (hour == 12) {
      this.HotelService.filterroom()
    }
  }


  loadForm() {
    this.getAllRoom();
    // this.getAcRoom();
    // this.getDeluxeRoom();
    // this.getNonAcRoom();
  }

  onSubmit() {
    if (this.profileForm.valid) {
      let customers = {} as customer
      customers.name = this.profileForm.value.name,
        customers.age = Number(this.profileForm.value.age),
        customers.phoneNumber = this.profileForm.value.phoneNumber,
        customers.gender = this.profileForm.value.gender,
        customers.address = this.profileForm.value.address,
        customers.citizenship = 'Nepali';
        customers.registerDate = '';

      this.Name = this.profileForm.value.name;
      this.Age = Number(this.profileForm.value.age);
      this.Phone = this.profileForm.value.phoneNumber;
      this.Gender = this.profileForm.value.gender;
      this.Address = this.profileForm.value.address;

      this.checkedIndates = this.profileForm.value.checkedIndate;
      this.checkedOutdates = this.profileForm.value.checkedOutdate;
      localStorage.setItem("checkedIndates",this.checkedIndates);
      localStorage.setItem("checkedOutdates",this.checkedOutdates);

      // console.log("Customer", customers)
      this.HotelService.registerCustomer(customers).subscribe(res => {
        if (res) {
          this.data = res;
          // console.log(this.data)
          this.toastr.success("User Registered Successfully", 'Success')
          localStorage.setItem("customerName",this.data.name);
          localStorage.setItem("customerId",this.data.customerId);
          this.customerName = localStorage.getItem("customerName")?.split(' ')[0].toLocaleUpperCase();
        } else {
          this.toastr.error("Something Went Wrong!!!", 'Error')
        }
        this.isRegistered = true;
        this.istrue = false;
        this.isdiscard = false;
        this.isprinted = false;
        // console.log("res", this.data)
        this.CustomerId = this.data;
      })
    }

  }

  logout(){
    this.isRegistered = false;
    this.isprinted = true;
    this.isdiscard = true;
    this.istrue = true;
    localStorage.clear();
  }

  RoomBook(room: any) {
    var checkindatee = localStorage.getItem("checkedIndates");
    let date = JSON.stringify(new Date(checkindatee ? checkindatee : '' ))
    date = date.slice(1,11)
    var checkoutdatee = localStorage.getItem("checkedOutdates")
    let date1 = JSON.stringify(new Date(checkoutdatee ? checkoutdatee : '' ))
    date1 = date1.slice(1,11)
    let bookings = {} as booking
    bookings.checkInDate = new Date(date);
    bookings.checkOutDate = new Date(date1);
    bookings.customerId = Number(localStorage.getItem("customerId"));
    bookings.price = room.price;
    bookings.noOfRooms = 1;

    // console.log(checkindatee)
    // console.log(date1)
    this.HotelService.bookRoom(bookings).subscribe(res => {
      this.ishidden = true;
      this.bookId = res;
      // console.log("bookid",this.bookId)
      if (res) {
        this.toastr.success("Room Booked ", 'Success')
      } else {
        this.toastr.error("Something Went Wrong!!!", 'Error')
      }
      this.HotelService.getBookingById(this.bookId).subscribe(res =>{
        this.bookingData = res;
        // console.log("bookingData",this.bookingData)
      })
      room.occupied = 'yes';
      room.bookingId = this.bookId;
      // console.log(room)
      this.HotelService.updateRoomOccupancy(room).subscribe(res => {
      })
    })
  }

  Discardbtn() {
    this.loadForm();
    this.istrue = true;
    this.ishidden = false;
    this.isprinted = true;
    // console.log(this.CustomerId)
    this.HotelService.deleteCustomerById(this.CustomerId).subscribe(res => {
      if (res) {
        this.toastr.success("deleted Userr Successfully")
      }
    })
    this.isdiscard = true;
    this.logout();
  }

  btnClick() {
    var CuustomerId = Number(localStorage.getItem("customerId"));
    let invoices = {} as Invoice;
    invoices.bookingId = this.bookId;
    invoices.customerId = CuustomerId;
    invoices.isprinted = 'no';
    // console.log("invoices", invoices)

    this.HotelService.createInvoice(invoices).subscribe(res => {
      this.invoice = res;
      this.isprinted = false;
      this.invoiceId = this.invoice;
      // console.log("invoice printed", this.invoiceId)
    })
    this.HotelService.getInvoice().subscribe(res => {
      this.invoicedata = res;
      // console.log("getInvoice", res)
    })
    this.loadForm();
    this.istrue = true;
    this.ishidden = false;
    this.isdiscard = true;

    this.HotelService.getCustomerById(CuustomerId).subscribe(res =>{
      this.customerDetails = res;
      // console.log(this.customerDetails)
    })
  }

  printInvoice() {
    // var CuustomerId = Number(localStorage.getItem("customerId"));

    let invoiced = new FormGroup({});
    invoiced.value.name = this.customerDetails.name;
    invoiced.value.age = this.customerDetails.age;
    invoiced.value.gender = this.customerDetails.gender;
    invoiced.value.address = this.customerDetails.address;
    invoiced.value.bookingId = this.bookId;
    invoiced.value.TotalPrice = this.bookingData.price;
    invoiced.value.invoiceId = this.invoiceId;
    invoiced.value.phoneNumber = this.customerDetails.phoneNumber;

    // console.log("invoice clickedddd", invoiced)
    // console.log("invoice clicked", invoiced)
    this.HotelService.printInvoice(invoiced.value).subscribe(res => {
    })
  }

  getBool(roomdata: any, type: string) {
    // console.log("ROom", roomdata);
    if (roomdata.typeOfRoom == type && (roomdata.occupied == 'no        ' || roomdata.occupied == 'no')) {
      return true;
    } else {
      return false;
    }
  }

  getAllRoom() {
    this.HotelService.getAllRoom().subscribe(res => {
      this.rooms = res;
      // console.log("all Rooms", res)
    })
    // console.log("rooms", this.rooms)
  }


  // getAcRoom() {
  //   this.HotelService.getRoomByType('Ac').subscribe(res => {
  //     this.ACRooms = res;
  //   })
  // }

  // getNonAcRoom() {
  //   this.HotelService.getRoomByType('NonAc').subscribe(res => {
  //     this.NonACRooms = res;
  //   })
  // }

  // getDeluxeRoom() {
  //   this.HotelService.getRoomByType('Deluxe').subscribe(res => {
  //     this.DeluxeRoom = res;
  //   })
  // }


}


