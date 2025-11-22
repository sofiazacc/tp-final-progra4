import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Marcador } from '../models/marcador';
import { Observable } from 'rxjs';
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

  postMarcador(marcador: any): Observable<Marcador> {
    return this.http.post<Marcador>(this.urlMarcadores, marcador);
  }

  putMarcador(id: string, marcador: Marcador): Observable<Marcador> {
    return this.http.put<Marcador>(`${this.urlMarcadores}/${id}`, marcador);
  }

  sincronizarMarcadores(posts: PostModelo[]): Observable<Marcador[]> {
    
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
      
      const nuevoMarcador: Omit<Marcador, 'id'> = {
        lat: postsDelGrupo[0].coordenadas!.lat,
        lng: postsDelGrupo[0].coordenadas!.lng,
        ubicacion: postsDelGrupo[0].ubicacion || 'Ubicación desconocida',
        postID: postsDelGrupo.map((post) => post.id),
      };

      marcadores.push(
        this.postMarcador(nuevoMarcador).toPromise() as Promise<Marcador>
      );
    });

    return new Observable<Marcador[]>((observer) => {
      Promise.all(marcadores).then((resultados) => {
        observer.next(resultados);
        observer.complete();
      });
    });
  }
}