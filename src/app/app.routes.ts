import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { Home } from './pages/home/home';
import { Feed } from './pages/feed/feed'; 
import { authGuard } from './guards/auth-guard';
import { Caculadora500Component } from './components/caculadora500-component/caculadora500-component';
import { CaculadoraHorasMagicasComponent } from './components/caculadora-horas-magicas-component/caculadora-horas-magicas-component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: 'auth', component: Auth },
    {path: 'home', component: Home },
    {path: 'calculators', component: Caculadora500Component},
    {path: 'calculators2', component: CaculadoraHorasMagicasComponent},
    {path: 'feed', component: Feed, canActivate: [authGuard] },
];
