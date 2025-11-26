import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs';
import { Fotografo, Usuario } from '../models/usuario';
import {  Router } from '@angular/router';

interface AuthResponse {
  accessToken: string;
  user: Usuario;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private backURL = 'http://localhost:3000';

  private _estaLogueado = new BehaviorSubject<boolean>(this.estaLogueadoInicial());
  public estaLogueado$ = this._estaLogueado.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private estaLogueadoInicial(): boolean {
    return localStorage.getItem('token_jwt') !== null;
  }

  login(credenciales: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.backURL}/login`, credenciales)
      .pipe(
        tap((respuesta) => {
          console.log("AuthService (tap): Guardando token y usuario...");
          this.guardarToken(respuesta.accessToken);
          this.guardarUsuario(respuesta.user);
          this._estaLogueado.next(true);
        })
      );
  } //El login es para cualquier tipo de usuario

register(fotografo: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.backURL}/register`, fotografo)
      .pipe(
        tap((respuesta) => {
                console.log(`Toke: ${respuesta.accessToken}`);
          console.log("AuthService (tap): Guardando token y usuario post-registro...");
    
          this.guardarToken(respuesta.accessToken);
          this.guardarUsuario(respuesta.user);
          this._estaLogueado.next(true);
          this.router.navigate(['/feed']);
        })
      );
  }//El registro es solo para fotógrafos

   guardarToken(token: string): void { 
   localStorage.setItem('token_jwt', token);
  }

  guardarUsuario(user: Usuario): void {
   localStorage.setItem('usuario_logueado', JSON.stringify(user));
  }

  cerrarSesion(): void {
   this._estaLogueado.next(false);
   localStorage.removeItem('token_jwt');
   localStorage.removeItem('usuario_logueado');
   sessionStorage.clear();
   this.router.navigate(['/auth']);


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
