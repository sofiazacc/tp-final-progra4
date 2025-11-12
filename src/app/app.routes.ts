import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { Home } from './pages/home/home';
import { Feed } from './pages/feed/feed'; 
import { Mapa} from './pages/mapa/mapa';
import { Perfil } from './pages/perfil/perfil';
import { Guardados } from './pages/guardados/guardados';
import { ArticulosAstronomicos } from './pages/articulos-astronomicos/articulos-astronomicos';
import { PostsAdmin } from './pages/posts-admin/posts-admin';
import { UsuariosAdmin } from './pages/usuarios-admin/usuarios-admin';

import { authGuard } from './guards/auth-guard';
import { rolGuard } from './guards/rol-guard';

export const routes: Routes = [
    {path: '', redirectTo: 'auth', pathMatch: 'full' },
    {path: 'auth', component: Auth },
    {path: 'home', component: Home },
    {path: 'feed', component: Feed, canActivate: [authGuard,rolGuard], data: {rol: 'fotografo'}},
    {path: 'mapa', component: Mapa, canActivate: [authGuard,rolGuard], data: {rol: 'fotografo'}},
    {path: 'perfil', component: Perfil, canActivate: [authGuard,rolGuard], data: {rol: 'fotografo'}},
    {path: 'guardados', component: Guardados, canActivate: [authGuard,rolGuard], data: {rol: 'fotografo'}},
    {path: 'articulos-astronomicos', component: ArticulosAstronomicos, canActivate: [authGuard,rolGuard], data: {rol: 'fotografo'}},
    {path: 'posts-admin', component: PostsAdmin, canActivate: [authGuard,rolGuard], data: {rol: 'admin'}},
    {path: 'usuarios-admin', component: UsuariosAdmin, canActivate: [authGuard,rolGuard], data: {rol: 'admin'}}
];
