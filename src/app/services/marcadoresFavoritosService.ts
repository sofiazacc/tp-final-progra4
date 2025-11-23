import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './authService';
import { Fotografo } from '../models/usuario';
import { Observable, tap } from 'rxjs';
import { Marcador } from '../models/marcador';
import { MarcadorService } from './marcadorService';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  constructor(private http: HttpClient, private usuarioService: AuthService, private marcadoresService: MarcadorService) {}

  private usuarios = 'http://localhost:3000/usuarios';



  //Verificamos si es favorito
  esFavorito(marcadorID: string):boolean {
    const usuarioActual = this.usuarioService.getfotografoActual();
    return usuarioActual!.marcadoresGuardadosID?.includes(marcadorID) || false;
  }

//Marcar o desmarcar como favorito
  marcarDesmarcarComoFavorito(marcadorID: string): Observable<Fotografo> {
    const usuarioActual = this.usuarioService.getUsuarioLogueado() as Fotografo;

    let marcadoresGuardados= usuarioActual.marcadoresGuardadosID || [];

    //si ya está guardado, lo quitamos; si no, lo agregamos
    if(this.esFavorito(marcadorID)){
      marcadoresGuardados = marcadoresGuardados.filter(id => id !== marcadorID);
    } else {
      marcadoresGuardados.push(marcadorID);
    }

    const datosActualizados = { marcadoresGuardadosID: marcadoresGuardados };

    return this.http.patch<Fotografo>(
  `http://localhost:3000/usuarios/${usuarioActual.id}/favoritos`, 
  datosActualizados
).pipe(
      //Actualizamos el usuario en el localStorage

      tap(() => {
        const usuarioActualizadoLocal = { ...usuarioActual, ...datosActualizados };
        this.usuarioService.guardarUsuario(usuarioActualizadoLocal as Fotografo);
      })
    );
  }

  obtenerMarcadoresFavoritos(): Observable<Marcador[]> {
    const fotografoActual = this.usuarioService.getfotografoActual();

    if(!fotografoActual || !fotografoActual.marcadoresGuardadosID || fotografoActual.marcadoresGuardadosID.length === 0){
      return new Observable<Marcador[]>(observer => {
        observer.next([]);
        observer.complete();
      });

    }

    //Obtenemos los marcadores por sus IDs y correspondientes al fotógrafo actual
    return new Observable<Marcador[]>(observer => {
      this.marcadoresService.getMarcadoresPorIds(fotografoActual.marcadoresGuardadosID!).subscribe(marcadores => {
        const favoritos = marcadores.filter(marcador => fotografoActual.marcadoresGuardadosID!.includes(marcador.id!));
        observer.next(favoritos);
        observer.complete();
      });
    });

  }

}
