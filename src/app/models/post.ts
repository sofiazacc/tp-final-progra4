import { Fotografo } from "./usuario";

export interface PostModelo{
    id: string;
    url: string;
    descripcion: string;
    ubicacion: string;
    coordenadas?: {
        lat: number,
        lng: number
    };
    fotografo: Fotografo;
    fecha: Date;
    eliminado: boolean;
    idUsuariosQueDieronLike: string[];
}