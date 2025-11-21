import { Fotografo } from "./usuario";

export interface PostModelo{
    id: string,
    url: string,
    descripcion: string,
    ubicacion: string,
    coordernadas?: {
        lat: number,
        lng: number
    },
    fotografo: Fotografo,
    fecha: Date,
    likes: number
}