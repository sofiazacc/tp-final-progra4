export interface Usuario {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: 'admin' | 'fotografo';
}

export interface Fotografo extends Usuario {
    rol: 'fotografo';
    nombreDeUsuario: string;
    localidad: string;
    provincia: string;
    posteosFavoritosID: string[];
    marcadoresGuardadosID: string[];
    fotoPerfil: string;
    posteosLikeadosID: string[];
}

export interface Admin extends Usuario {
    rol: 'admin';
}
