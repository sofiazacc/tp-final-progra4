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

export const routes: Routes = [
    {path: '', redirectTo: 'auth', pathMatch: 'full' },
    {path: '**', redirectTo: 'auth', pathMatch: 'full' },
    {path: 'auth', component: Auth },
    {path: 'home', component: Home },
    {path: 'feed', component: Feed, canActivate: [authGuard] },
    {path: 'mapa', component: Mapa },
    {path: 'perfil', component: Perfil },
    {path: 'guardados', component: Guardados },
    {path: 'articulos-astronomicos', component: ArticulosAstronomicos },
    {path: 'posts-admin', component: PostsAdmin },
    {path: 'usuarios-admin', component: UsuariosAdmin }
];
