import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from "../service/auth/user.service";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  notificationList: any;
  dashboardCount: any = {};
  constructor(private userService: UserService, private toastr: ToastrService){
    
  }
  ngOnInit(): void {
    this.getNotifications(); 
    this.getDashboardCount();  
    this.getTotalCount();   
  }

  getTotalCount(){
    this.userService.getTotalCount().subscribe(
      (resp) => {
        this.dashboardCount.totalCount = resp.totalCount;
      },
      (error) => {
        this.toastr.error("", error.error.message, {
          titleClass: "left",
          messageClass: "left"
        });
          console.log("err:"+JSON.stringify(error.error));
      });
  }
  
  getDashboardCount(){
    this.userService.getCount().subscribe(
      (resp) => {
        this.dashboardCount.asApproved = resp.data[0].count;
        this.dashboardCount.amlApproved = resp.data[1].count;
      },
      (error) => {
        this.toastr.error("", error.error.message, {
          titleClass: "left",
          messageClass: "left"
        });
          console.log("err:"+JSON.stringify(error.error));
      });
  }
  getNotifications(){
    this.userService.getNotifications().subscribe(
      (resp) => {
        this.notificationList = resp.data;
        
      },
      (error) => {
        this.toastr.error("", error.error.message, {
          titleClass: "left",
          messageClass: "left"
        });
          console.log("err:"+JSON.stringify(error.error));
      });
  }
}
