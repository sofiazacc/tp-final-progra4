import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fotografo, Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  
  private url = 'http://localhost:3000/users'; 

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Fotografo[]> {
    return this.http.get<Fotografo[]>(this.url);
  }

  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  modificarUsuario(usuario: Usuario): Observable<Usuario>{
    return this.http.patch<Usuario>(`${this.url}/${usuario.id}`, usuario)
  }

  modificarUsuarioPut(usuario: Usuario): Observable<any>{
    return this.http.put<any>(`${this.url}/${usuario.id}`, usuario)
  }
}