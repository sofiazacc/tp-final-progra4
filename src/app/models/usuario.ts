export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: 'admin' | 'fotografo';
}

export interface Fotografo extends Usuario {
    rol: 'fotografo';
    nombreDeUsuario: string;
    ciudad: string;
}

export interface Admin extends Usuario {
    rol: 'admin';
}
