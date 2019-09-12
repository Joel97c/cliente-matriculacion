import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {User} from '../../layout/matriculacion/modelos/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
    user: User;

    constructor(private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot) {
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        if (localStorage.getItem('isLoggedin') === 'true') {
            switch (route['_routerState']['url']) {
                case '/dashboard-matricula':
                    if (this.user.role.rol === '3' || this.user.role.rol === '4') {
                        return true;
                    }
                    break;
                case '/dashboard-cupo':
                    if (this.user.role.rol === '1') {
                        return true;
                    }
                    break;
                case '/dashboard':
                    if (this.user.role.rol === '3' || this.user.role.rol === '4') {
                        return true;
                    }
                    break;
                case '/matricula':
                    if (this.user.role.rol === '3' || this.user.role.rol === '4') {
                        return true;
                    }
                    break;
                case '/cupos':
                    if (this.user.role.rol === '1' || this.user.role.rol === '4') {
                        return true;
                    }
                    break;
                case '/perfil-estudiante':
                    if (this.user.role.rol === '2') {
                        return true;
                    }
                    break;
                case '/usuarios':
                    if (this.user.role.rol === '4') {
                        return true;
                    }
                    break;
                case '/ajustes':
                    if (this.user.role.rol === '4') {
                        return true;
                    }
                    break;
                default:
                    this.router.navigate(['/access-denied']);
                    return false;
                    break;
            }
            this.router.navigate(['/access-denied']);
            return false;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
