import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Generic GET request
   * @param path API endpoint path
   * @param params Query parameters
   * @returns Observable of the response
   */
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, { params });
  }

  /**
   * Generic POST request
   * @param path API endpoint path
   * @param body Request body
   * @returns Observable of the response
   */
  post<T>(path: string, body: any = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body);
  }

  /**
   * Generic PUT request
   * @param path API endpoint path
   * @param body Request body
   * @returns Observable of the response
   */
  put<T>(path: string, body: any = {}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body);
  }

  /**
   * Generic DELETE request
   * @param path API endpoint path
   * @returns Observable of the response
   */
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`);
  }

  /**
   * Generic PATCH request
   * @param path API endpoint path
   * @param body Request body
   * @returns Observable of the response
   */
  patch<T>(path: string, body: any = {}): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${path}`, body);
  }
}
