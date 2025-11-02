import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fotografo } from '../models/usuario';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${email}&password=${password}&rol=fotografo`);
  } //El login es para cualquier tipo de usuario

  register(fotografo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, fotografo);
  } //El registro es solo para fotógrafos


}
