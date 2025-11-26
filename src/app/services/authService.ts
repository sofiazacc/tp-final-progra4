import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { Fotografo, Usuario } from '../models/usuario';
import {  Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private backURL = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  login(credenciales: any): Observable<{accessToken: string, user: Usuario}> {
    return this.http.post<{accessToken: string, user: Usuario}>(`${this.backURL}/login`, credenciales)
      .pipe(
        tap((respuesta) => {
          console.log("AuthService (tap): Guardando token y usuario...");
          this.guardarToken(respuesta.accessToken);
          this.guardarUsuario(respuesta.user);
        })
      );
  } //El login es para cualquier tipo de usuario

  register(fotografo: any): Observable<{accessToken: string, user: Usuario}> {
    return this.http.post<{accessToken: string, user: Usuario}>(`${this.backURL}/register`, fotografo)
      .pipe(
        tap((respuesta) => {
                console.log(`Toke: ${respuesta.accessToken}`);
          console.log("AuthService (tap): Guardando token y usuario post-registro...");
    
          this.guardarToken(respuesta.accessToken);
          this.guardarUsuario(respuesta.user);
        })
      );
  }//El registro es solo para fotógrafos

  verificarPassword(id: string, password: string): Observable<{valid: boolean, message: string}> {
    return this.http.post<{valid: boolean, message: string}>(`${this.backURL}/verificar-password`, { id, password });
  }

  cambiarPassword(id: string, nuevaPass: string): Observable<any> {
    return this.http.post(`${this.backURL}/auth/cambiar-password`, { id, nuevaPassword: nuevaPass });
  }

   guardarToken(token: string): void { 
   localStorage.setItem('token_jwt', token);
  }

  guardarUsuario(user: Usuario): void {
   localStorage.setItem('usuario_logueado', JSON.stringify(user));
  }

  cerrarSesion(): void {
   localStorage.removeItem('token_jwt');
   localStorage.removeItem('usuario_logueado');
   sessionStorage.clear();
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


   getfotografoActual(): Fotografo  {
    const user = this.getUsuarioLogueado();
    // Aquí hacemos el truco: lo tratamos como Fotografo
    return user as Fotografo; 
  }
}
