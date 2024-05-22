import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { UserService } from "../service/auth/user.service";
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  notificationList: any;
  searchText: string;
  startDate: any;
  endDate: any;
  isUpdateOpen: boolean = false;
  formData: any = {}
  constructor(private userService: UserService, private toastr: ToastrService) {
    this.searchText = '';
  }
  ngOnInit(): void {
    this.formData = {
      agentEmail: '',
      agentFName: '',
      agentLName: '',
      accType: '',
      appStatus: '',
      busCat: ''
    }
    this.getNotifications();
  }

  resetData(){
    this.formData = {
      agentEmail: '',
      agentFName: '',
      agentLName: '',
      accType: '',
      appStatus: '',
      busCat: ''
    }
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
    if(this.startDate && this.endDate){
      let startDate = moment(this.startDate).format('DD-MM-YYYY');
      let endDate = moment(this.endDate).format('DD-MM-YYYY');
      reqBody.startDate = startDate;
      reqBody.endDate = endDate;
    }
    this.searchNotifications(reqBody)
  }

  searchNotifications(reqBody: any) {
    console.log(JSON.stringify(reqBody));
    
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
  openAdd(){
    this.isUpdateOpen = false;
    this.openForm()
  }
  openForm(){
    let hideElem = document.getElementsByClassName('hide-on-add');
    // hideElem.classList.add('hide')
    for(var i = 0; i < hideElem.length; i++)
    {
        hideElem[i].classList.add('hide');
        console.log(hideElem[i].className);
    }
    let showElement = document.getElementById('create')
    showElement?.classList.remove('hide')
  }


  async addApplication(){
    console.log("data::"+JSON.stringify(this.formData));
    let validationResp = await this.validateData();
    if(validationResp){
      this.userService.addApplication(this.formData).subscribe(
        (resp) => {
          this.toastr.success("", resp.message, {
            titleClass: "left",
            messageClass: "left"
          });
          this.resetData();
          this.getNotifications();
          this.closeAdd()
        },
        (error) => {
          this.toastr.error("", error.error.message, {
            titleClass: "left",
            messageClass: "left"
          });
          console.log("err:" + JSON.stringify(error.error));
        });
    }
    // alert(validationResp)
    // this.closeAdd();
  }

  async editApplication(){
    console.log("data::"+JSON.stringify(this.formData));
    let validationResp = await this.validateData();
    if(validationResp){
      this.userService.editApplication(this.formData).subscribe(
        (resp) => {
          this.toastr.success("", resp.message, {
            titleClass: "left",
            messageClass: "left"
          });
          this.resetData();
          this.getNotifications();
          this.closeAdd()
        },
        (error) => {
          this.toastr.error("", error.error.message, {
            titleClass: "left",
            messageClass: "left"
          });
          console.log("err:" + JSON.stringify(error.error));
        });
    }
    // alert(validationResp)
    // this.closeAdd();
  }

  closeAdd(){
    let hideElem = document.getElementsByClassName('hide-on-add');
    // hideElem.classList.add('hide')
    for(var i = 0; i < hideElem.length; i++)
    {
        hideElem[i].classList.remove('hide');
        console.log(hideElem[i].className);
    }
    let showElement = document.getElementById('create')
    showElement?.classList.add('hide')
  }

  isNullOrEmpty(string: string){
    if(string == null || string == undefined || string == ''){
      return true;
    }
    return false;
  }

  validateData(){
    var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!validRegex.test(this.formData.agentEmail)){
      this.toastr.error("", `Invalid Email Address`, {
        titleClass: "left",
        messageClass: "left"
      });
      return false
    }else if((this.isNullOrEmpty(this.formData.agentFName))){
      this.toastr.error("", `Please Enter Valid Agent First Name`, {
        titleClass: "left",
        messageClass: "left"
      });
      return false;
    }else if((this.isNullOrEmpty(this.formData.agentLName))){
      this.toastr.error("", `Please Enter Valid Agent Last Name`, {
        titleClass: "left",
        messageClass: "left"
      });
      return false;
    }else if((this.isNullOrEmpty(this.formData.busCat))){
      this.toastr.error("", `Please Select Business Category`, {
        titleClass: "left",
        messageClass: "left"
      });
      return false;
    }else if((this.isNullOrEmpty(this.formData.appStatus))){
      this.toastr.error("", `Please Select Application Status`, {
        titleClass: "left",
        messageClass: "left"
      });
      return false;
    }else if((this.isNullOrEmpty(this.formData.accType))){
      this.toastr.error("", `Please Select Account Type`, {
        titleClass: "left",
        messageClass: "left"
      });
      return false;
    }else{
      return true;
    }
  }

  editApp(application: any){
    this.isUpdateOpen = true;
    // alert("Edit")
    this.formData = {
      agentEmail: application.sales_agent_email,
      agentFName: application.sales_agent_first_name,
      agentLName: application.sales_agent_last_name,
      accType: application.account_type,
      appStatus: application.application_status,
      busCat: application.business_category
    }
    this.formData.applicationId = application.business_application_id;
    this.openForm()
  }

  async deleteApp(application: any){
    let text;
    if (confirm('Are you sure you want to delete the application?') == true) {
      
      await this.userService.deleteApplication(application.business_application_id).subscribe(
        async (resp) => {
          this.toastr.success("", resp.message, {
            titleClass: "left",
            messageClass: "left"
          });
          await this.getNotifications();
          this.resetData();
          this.closeAdd();
        },
        (error) => {
          this.toastr.error("", error.error.message, {
            titleClass: "left",
            messageClass: "left"
          });
          console.log("err:" + JSON.stringify(error.error));
        });
    } else {
    }
  }

}
