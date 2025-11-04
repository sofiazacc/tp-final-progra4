import { Fotografo } from "./usuario";

export interface PostModelo{
    id: string,
    url: string,
    descripcion: string,
    ubicacion: string,
    fotografo: Fotografo,
    fecha: Date,
    likes: number
}