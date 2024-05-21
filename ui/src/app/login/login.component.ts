import { Component, OnInit } from '@angular/core';
import { UserService } from "../service/auth/user.service";
import {ToastrService} from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username: any;
  password: any;
  constructor(private userService: UserService, private toastr: ToastrService, private router: Router) {}

  ngOnInit() {
    // this.user.currentUserData.subscribe(userData => (this.userData = userData));
  }

  changeData(event: any) {
    var msg = event.target.value;
    // this.user.changeData(msg);
  }
  login() {
    let loginData = {
      username: this.username,
      password: this.password

    }
    this.userService.login(loginData).subscribe(
      (resp) => {
        // this.router.navigate(['dashboard']);
        this.router.navigate(['/dashboard']);
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