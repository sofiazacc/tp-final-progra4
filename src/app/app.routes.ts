import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Feed } from './pages/feed/feed'; 
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: 'login', component: Login },
    {path: 'home', component: Home },
    {path: 'feed', component: Feed, canActivate: [authGuard] }
];
