import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'http://localhost:4200';
  
  constructor(private http: HttpClient) { }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`/api/authenticate`, userData);
  }

  getNotifications(): Observable<any> {
    return this.http.get<any>(`/api/getNotification`);
  }

  getCount(): Observable<any> {
    return this.http.get<any>(`/api/dashboard-count`);
  }
  getTotalCount(): Observable<any> {
    return this.http.get<any>(`/api/total-count`);
  }

  getAllApplications(): Observable<any> {
    return this.http.get<any>(`/api/getAllApplications`);
  }

  filterData(reqBody: any): Observable<any> {
    let paramArr = [];
    if(reqBody.search){
      paramArr.push(`search=${reqBody.search}`)
    }
    if(reqBody.startDate){
      paramArr.push(`startDate=${reqBody.startDate}`)
    }
    if(reqBody.endDate){
      paramArr.push(`endDate=${reqBody.endDate}`)
    }
    let paramString = paramArr.join('&')
    // reqBody = 
    return this.http.get<any>(`/api/getAllApplications?${paramString}`);
  }

  // editApplication
  editApplication(data: any): Observable<any> {
    return this.http.post<any>(`/api/editApplication`, data);
  }
  
  addApplication(data: any): Observable<any> {
    return this.http.post<any>(`/api/addApplication`, data);
  }
  deleteApplication(id: any): Observable<any> {
    return this.http.post<any>(`/api/deleteApplication?id=${id}`, {});
  }
}
