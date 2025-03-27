import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
  updateUser(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userData.id}`, userData);
  }

  // deleteUser(id: number): Observable<void> {
  //   return this.http.delete<void>(`http://localhost:5159/api/users/${id}`);
  // }
  getPagedUsers(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }
}
