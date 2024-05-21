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
}
