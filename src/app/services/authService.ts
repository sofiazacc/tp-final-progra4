import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private backURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

login(credenciales: any): Observable<{accesToken: string, user: Usuario}> {
   return this.http.post<{accesToken: string, user: Usuario}>(`${this.backURL}/login`, credenciales).pipe(
      tap(response => {
        this.guardarToken(response.accesToken);
        this.guardarUsuario(response.user)
      })
    );
  } //El login es para cualquier tipo de usuario

  register(fotografo: any): Observable<any> {
    return this.http.post(`${this.backURL}/register`, fotografo);
  }    //El registro es solo para fotógrafos

   guardarToken(token: string): void { 
   localStorage.setItem('token_jwt', token);
  }

  guardarUsuario(user: Usuario): void {
   localStorage.setItem('usuario_logueado', JSON.stringify(user));
  }

  cerrarSesion(): void {
   localStorage.removeItem('token_jwt');
   localStorage.removeItem('usuario_logueado');
  }

  estaLogueado(): boolean {
   return localStorage.getItem('token_jwt') !== null;
  }

  getToken(): string | null {
   return localStorage.getItem('token_jwt');
  }

  getUsuarioLogueado(): Usuario | null {
   const usuarioJSON = localStorage.getItem('usuario_logueado');
    
  if(!usuarioJSON){
     return null;
  }

   return JSON.parse(usuarioJSON) as Usuario;
  }
}
