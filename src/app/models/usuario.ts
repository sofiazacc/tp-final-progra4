export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: 'admin' | 'fotografo';
    fotoPerfil: string;
    eliminado: boolean;
}

export interface Fotografo extends Usuario {
    rol: 'fotografo';
    nombreDeUsuario: string;
    localidad: string;
    provincia: string;
    posteosFavoritosID: string[];
    marcadoresGuardadosID: string[];
}

export interface Admin extends Usuario {
    rol: 'admin';
}
