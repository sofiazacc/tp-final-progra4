import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Marcador } from '../models/marcador';
import { lastValueFrom, Observable } from 'rxjs';
import { PostModelo } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class MarcadorService {
  constructor(private http: HttpClient) {}

  private urlMarcadores = 'http://localhost:3000/marcadores';

  getMarcadores(): Observable<Marcador[]> {
    return this.http.get<Marcador[]>(this.urlMarcadores);
  }

  getMarcadoresPorIds(ids: string[]): Observable<Marcador[]> {
    const query = ids.map(id => `id=${id}`).join('&');
    return this.http.get<Marcador[]>(`${this.urlMarcadores}?${query}`);
  }
  
  postMarcador(marcador: any): Observable<Marcador> {
    return this.http.post<Marcador>(this.urlMarcadores, marcador);
  }

  putMarcador(id: string, marcador: Marcador): Observable<Marcador> {
    return this.http.put<Marcador>(`${this.urlMarcadores}/${id}`, marcador);
  }

  sincronizarMarcadores(posts: PostModelo[]): Observable<Marcador[]> {

    return new Observable<Marcador[]>((observer) => {
      this.getMarcadores().subscribe((marcadoresExistentes) => {
    // Se agrupan los posts por ubicación (latitud y longitud)
    const grupos: { [key: string]: PostModelo[] } = {};
    posts.forEach((post) => {
      if (post.coordenadas) {
        const key = `${post.coordenadas.lat},${post.coordenadas.lng}`;
        if (!grupos[key]) grupos[key] = [];
        grupos[key].push(post);
      }
    });

    // Se crean los marcadores a partir de los grupos
    const marcadores: Promise<Marcador>[] = [];
    
    Object.keys(grupos).forEach((key) => {
      const postsDelGrupo = grupos[key];
      const lat = postsDelGrupo[0].coordenadas!.lat;
      const lng = postsDelGrupo[0].coordenadas!.lng;
      const nuevosIDs = postsDelGrupo.map((post) => post.id);
    
      const marcadorExistente = marcadoresExistentes.find((marcador) =>
        marcador.lat === lat && marcador.lng === lng
      );

      //Si existe, 
      if (marcadorExistente) {
          const ids = [new Set([
            ...marcadorExistente.postID,
            ...nuevosIDs
          ])];


        //Si hay cambios, se actualiza
          if(ids.length !== marcadorExistente.postID.length){
            marcadorExistente.postID = Array.from(ids[0]);
            marcadores.push(
              lastValueFrom(this.putMarcador(marcadorExistente.id, marcadorExistente))
            );
          }
      }else{
        //Si no existe, se crea uno nuevo
        const nuevoMarcador: Omit<Marcador,'id'> = {
          lat: lat,
          lng: lng,
          ubicacion: postsDelGrupo[0].ubicacion || 'Ubicación desconocida',
          postID: nuevosIDs,
      };

        marcadores.push(
          lastValueFrom(this.postMarcador(nuevoMarcador))
        );
      }
      
    });

    if (marcadores.length > 0) {
      Promise.all(marcadores).then((resultados) => {
        this.getMarcadores().subscribe((marcadoresActualizados) => {
          observer.next(marcadoresActualizados);
          observer.complete();
        });
      });
    } else {
      // No hay marcadores para crear o actualizar
      observer.next(marcadoresExistentes);
      observer.complete();
  
    }
  });
  });
}
}