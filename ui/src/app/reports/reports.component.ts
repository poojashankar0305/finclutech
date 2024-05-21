import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from "../service/auth/user.service";
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  notificationList: any;
  searchText: string;
  constructor(private userService: UserService, private toastr: ToastrService) {
    this.searchText = '';
  }
  ngOnInit(): void {
    this.getNotifications();
  }

  generateCSV(){
    this.convertToCSV(this.notificationList, 'Applicatiions', true)
  }

  getNotifications() {
    this.userService.getAllApplications().subscribe(
      (resp) => {
        this.notificationList = resp.data;
      },
      (error) => {
        this.toastr.error("", error.error.message, {
          titleClass: "left",
          messageClass: "left"
        });
        console.log("err:" + JSON.stringify(error.error));
      });
  }
  convertToCSV(JSONData: any, ReportTitle: any, ShowLabel: any) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';
    //This condition will generate the Label/Header
    if (ShowLabel) {
      var row = "";

      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {
        //Now convert each value to string and comma-seprated
        row += index + ',';
      }
      row = row.slice(0, -1);
      //append Label row with line break
      CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
      var row = "";
      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index in arrData[i]) {
        row += '"' + arrData[i][index] + '",';
      }
      row.slice(0, row.length - 1);
      //add a line break after each row
      CSV += row + '\r\n';
    }

    if (CSV == '') {
      alert("Invalid data");
      return;
    }

    //this trick will generate a temp "a" tag
    var link = document.createElement("a");
    link.id = "lnkDwnldLnk";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);

    var csv = CSV;
    var blob = new Blob([csv], { type: 'text/csv' });
    var csvUrl = window.webkitURL.createObjectURL(blob);
    var filename = (ReportTitle || 'UserExport') + '.csv';
    link.setAttribute('download', filename);
    link.setAttribute('href', csvUrl);
    link.click()

    // $('#lnkDwnldLnk')[0].click();
    document.body.removeChild(link);
  }

  searchData(){
    console.log(this.searchText);
    
    let reqBody: any = {};
    if(this.searchText != ''){
      reqBody.search = this.searchText;
    }
    this.searchNotifications(reqBody)
  }

  searchNotifications(reqBody: any) {
    
    this.userService.filterData(reqBody).subscribe(
      (resp) => {
        this.notificationList = resp.data;
      },
      (error) => {
        this.toastr.error("", error.error.message, {
          titleClass: "left",
          messageClass: "left"
        });
        console.log("err:" + JSON.stringify(error.error));
      });
  }
}
