import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HotelService } from '../Service/hotel.service';

@Component({
  selector: 'app-room-upsert',
  templateUrl: './room-upsert.component.html',
  styleUrls: ['./room-upsert.component.css']
})
export class RoomUpsertComponent implements OnInit {

  dataForm :FormGroup = new FormGroup({});
  progress: number = 0;
  message: string = '';
  @Output() public onUploadFinished = new EventEmitter();
  response =  {dbPath: ''};
  filename:string = '';

  constructor(private roomservice:HotelService,private toastr: ToastrService,private http:HttpClient) { }

  upsertForm = new FormGroup({
    typeOfRoom: new FormControl('',Validators.required),
    price : new FormControl('',Validators.required),
    roomNo : new FormControl('',Validators.required),
  });

  deleteForm = new FormGroup({
    roomNo : new FormControl('',Validators.required)
  })

  updateForm = new FormGroup({
    roomNo : new FormControl('',Validators.required)
  })

  ngOnInit(): void {
  }

  upsertRoom(){
    // console.log(this.upsertForm.value)
    this.dataForm.value.typeOfRoom = this.upsertForm.value.typeOfRoom;
    this.dataForm.value.price = this.upsertForm.value.price;
    this.dataForm.value.roomNo = this.upsertForm.value.roomNo;
    this.dataForm.value.occupied = 'no';
    this.dataForm.value.imagePath = this.filename;
    // console.log(this.dataForm.value)
    this.roomservice.addnewRoom(this.dataForm.value).subscribe(res =>{
      if(res){
        this.toastr.success("Room added Successfully");
        this.progress  = 0;
        this.message = '';
      }else{
        this.toastr.error("Something Went Wrong!!!");
      }
    })
  }

  deleteRoom(){
    // console.log(this.deleteForm.value)
    this.roomservice.deleteRoomByroomNo(this.deleteForm.value.roomNo).subscribe(res =>{
      if(res){
        this.toastr.success("Room deleted Successfully");
      }else{
        this.toastr.error("Something Went Wrong!!!");
      }
    })
  }

  updateRoom(){
    // console.log(this.updateForm.value.roomNo)
    this.roomservice. updateRoomOccupancyByRoomNo(this.updateForm.value.roomNo).subscribe(res =>{
      if(res){
        this.toastr.success("Room updated Successfully");
      }else{
        this.toastr.error("Something Went Wrong!!!");
      }
    })
  }

  uploadFile = (files:any) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    this.filename =  fileToUpload.name;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    
    this.http.post('https://localhost:7106/api/Room/Upload', formData, {reportProgress: true, observe: 'events'})
      .subscribe({
        next: (event) => {
          // console.log(event)
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / (event.total? event.total : 1));
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        }
      },
      error: (err: HttpErrorResponse) => console.log(err)
    });
  }

}
