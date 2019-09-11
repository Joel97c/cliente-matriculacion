import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {NgxSpinnerService} from 'ngx-spinner';
import {ServiceService} from '../layout/matriculacion/service.service';
import {User} from '../layout/matriculacion/modelos/user.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  password: string;
  repeatPassword: string;
  user: User;

  constructor(private router: Router, private service: ServiceService, private spinner: NgxSpinnerService,) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')) as User;
  }

  resetPassword() {
    if (this.validatePasswords()) {
      this.spinner.show();
      this.service.update('users/reset_password', {'user': this.user})
        .subscribe(
          response => {
            this.spinner.hide();
            if (response['role_id'] == '1') {
              console.log(response['role_id']);
              this.router.navigate(['cupos']);
            }
            if (response['role_id'] == '2') {
              this.router.navigate(['perfil-estudiante']);
            }
            if (response['role_id'] == '3') {
              this.router.navigate(['dashboard-matricula']);
            }

            if (response['role_id'] == '4') {
              this.router.navigate(['dashboard-matricula']);
            }
          },
          error => {
            this.spinner.hide();
          });
    } else {
      swal.fire('Las contraseñas no coinciden', '', 'error');
    }
  }

  validatePasswords(): boolean {
    if (this.user.password !== this.repeatPassword) {
      return false;
    }
    return true;
  }

  redirect() {
    if (this.user.role.rol == '1') {
      this.router.navigate(['cupos']);
    }
    if (this.user.role.rol == '2') {
      this.router.navigate(['perfil-estudiante']);
    }
    if (this.user.role.rol == '3') {
      this.router.navigate(['dashboard-matricula']);
    }

    if (this.user.role.rol == '4') {
      this.router.navigate(['dashboard-matricula']);
    }
  }
}
