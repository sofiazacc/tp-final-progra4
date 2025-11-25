import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { Home } from './pages/home/home';
import { Feed } from './pages/feed/feed'; 
import { Mapa} from './pages/mapa/mapa';
import { Perfil } from './pages/perfil/perfil';
import { Guardados } from './pages/guardados/guardados';
import { EventosAstronomicos } from './pages/eventos-astronomicos/eventos-astronomicos';
import { PostsAdmin } from './pages/posts-admin/posts-admin';
import { UsuariosAdmin } from './pages/usuarios-admin/usuarios-admin';
import { Caculadora500Component } from './components/caculadora500-component/caculadora500-component';
import { CaculadoraHorasMagicasComponent } from './components/caculadora-horas-magicas-component/caculadora-horas-magicas-component';
import { PosicionViaLacteaComponent } from './components/posicion-via-lactea/posicion-via-lactea';
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
    {path: 'eventos', component: EventosAstronomicos, canActivate: [authGuard,rolGuard], data: {rol: 'fotografo'}},
    {path: 'posts-admin', component: PostsAdmin, canActivate: [authGuard,rolGuard], data: {rol: 'admin'}},
    {path: 'usuarios-admin', component: UsuariosAdmin, canActivate: [authGuard,rolGuard], data: {rol: 'admin'}},
    {path: 'calculatora', component: Caculadora500Component, canActivate: [authGuard,rolGuard], data: {rol: 'fotografo'}},
    {path: 'calculatora2', component: CaculadoraHorasMagicasComponent, canActivate: [authGuard,rolGuard], data: {rol: 'fotografo'}},
    {path: 'viaLactea', component: PosicionViaLacteaComponent, canActivate: [authGuard,rolGuard], data: {rol: 'fotografo'}}
];
