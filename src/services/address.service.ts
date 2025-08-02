import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private baseUrl = 'https://esgoo.net/api-tinhthanh';

  constructor(private http: HttpClient) {}

  getProvinces(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/1/0.htm`).pipe(
      map(response => response?.data || [])
    );
  }

  getDistricts(provinceId: string): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/2/${provinceId}.htm`).pipe(
      map(response => response?.data || [])
    );
  }

  getWards(districtId: string): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/3/${districtId}.htm`).pipe(
      map(response => response?.data || [])
    );
  }
}