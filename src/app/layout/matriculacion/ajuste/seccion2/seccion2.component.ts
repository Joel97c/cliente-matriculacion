import {Component, OnInit} from '@angular/core';
import {ServiceService} from '../../service.service';
import {catalogos} from '../../../../../environments/catalogos';
import {NgxSpinnerService} from 'ngx-spinner';
import {PeriodoLectivo} from '../../modelos/periodo-lectivo.model';
import swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../../modelos/user.model';
import {Rol} from '../../modelos/rol.model';
import {Carrera} from '../../modelos/carrera.model';

@Component({
    selector: 'app-seccion2',
    templateUrl: './seccion2.component.html',
    styleUrls: ['./seccion2.component.scss']
})
export class Seccion2Component implements OnInit {
    constructor(private spinner: NgxSpinnerService, private service: ServiceService, private modalService: NgbModal) {
    }

    buscador: string;
    carrera: Carrera;
    carreras: Array<Carrera>;
    carrerasSeleccionadas: Array<Carrera>;
    usuarios: Array<User>;
    roles: Array<Rol>;
    usuarioSeleccionado: User;
    messages: any;
    actual_page: number;
    records_per_page: number;
    total_pages: number;
    total_register: number;
    total_pages_pagination: Array<any>;
    total_pages_temp: number;
    flagPagination: boolean;

    ngOnInit() {
        this.carrerasSeleccionadas = new Array<Carrera>();
        this.flagPagination = true;
        this.total_pages_pagination = new Array<any>();
        this.total_pages_temp = 10;
        this.records_per_page = 7;
        this.actual_page = 1;
        this.total_pages = 1;
        this.usuarios = new Array<User>();
        this.usuarioSeleccionado = new User();
        this.messages = catalogos.messages;
        this.getUsuarios(1);
        this.getRoles();
        this.getCarreras();
    }

    getUsuarios(page: number) {
        this.spinner.show();
        this.actual_page = page;
        const parameters = '?' + 'records_per_page=' + this.records_per_page
            + '&page=' + page;
        this.service.get('usuarios' + parameters).subscribe(
            response => {
                this.usuarios = response['usuarios']['data'];
                this.total_pages = response['pagination']['last_page'];
                this.total_register = response['pagination']['total'];
                this.crearNumerosPaginacion();
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }

    getUsuario() {
        this.total_pages = 1;
        this.crearNumerosPaginacion();
        this.buscador = this.buscador.toUpperCase();
        const parametros =
            '?email=' + this.buscador
            + '&name=' + this.buscador
            + '&user_name=' + this.buscador
            + '&estado=' + this.buscador;
        this.spinner.show();
        this.service.get('usuarios/filter' + parametros).subscribe(
            response => {
                this.usuarios = response['usuarios'];
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }

    getRoles() {
        this.spinner.show();

        this.service.get('roles').subscribe(
            response => {
                this.roles = response['roles'];
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }

    getCarreras() {
        this.spinner.show();
        this.service.get('carreras').subscribe(
            response => {
                this.carreras = response['carreras'];
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }

    deleteUsuario(usuario: User) {
        this.spinner.show();
        const parameters = '?' + 'id=' + usuario.id;
        this.service.get('usuarios' + parameters).subscribe(
            response => {
                this.getUsuarios(this.actual_page);
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }

    createUsuario() {
        this.spinner.show();
        this.service.post('usuarios', {'usuario': this.usuarioSeleccionado}).subscribe(
            response => {
                this.getUsuarios(this.actual_page);
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
                if (error.error.errorInfo[0] === '23505') {
                    swal.fire(this.messages['error23505']);
                } else {
                    swal.fire(this.messages['error500']);
                }
            });
    }

    updateUsuario(usuario: User) {
        this.spinner.show();
        this.service.update('usuarios', {'usuario': usuario}).subscribe(
            response => {
                this.getUsuarios(this.actual_page);
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
                if (error.error.errorInfo[0] === '23505') {
                    swal.fire(this.messages['error23505']);
                } else {
                    swal.fire(this.messages['error500']);
                }
            });
    }

    crearNumerosPaginacion() {
        if (this.total_pages > 10) {
            for (let i = 0; i < 10; i++) {
                this.total_pages_pagination[i] = i + this.total_pages_temp - 9;
            }
        } else {
            this.total_pages_pagination = new Array<any>();
            for (let i = 0; i < this.total_pages; i++) {
                this.total_pages_pagination[i] = i + 1;
            }
        }
    }

    firstPagina() {
        this.getUsuarios(1);
        this.total_pages_temp = 10;
        this.crearNumerosPaginacion();
    }

    lastPagina() {
        this.getUsuarios(this.total_pages);
        this.total_pages_temp = this.total_pages;
        this.crearNumerosPaginacion();
    }

    paginacion(siguiente: boolean) {
        if (siguiente) {
            if (this.actual_page === this.total_pages) {
                return;
            } else {
                if (this.total_pages_temp !== this.total_pages) {
                    this.total_pages_temp++;
                    this.crearNumerosPaginacion();
                }

                this.actual_page++;
            }
        } else {
            if (this.actual_page === 1) {
                return;
            } else {
                this.actual_page--;
                this.total_pages_temp--;
                this.crearNumerosPaginacion();
            }
        }
        this.getUsuarios(this.actual_page);
    }

    openUsuario(content, usuario) {
        if (usuario != null) {
            this.llenarCarreras(usuario);
            this.usuarioSeleccionado = usuario;
        } else {
            this.carreras.forEach(carrera => {
                carrera.seleccionada = false;
            });
            this.usuarioSeleccionado = new User();
        }
        this.modalService.open(content)
            .result
            .then((resultModal => {
                if (resultModal === 'save') {
                    if (usuario == null) {
                        this.createUsuario();
                    } else {
                        this.updateUsuario(usuario);
                    }
                } else {
                    this.getUsuarios(this.actual_page);
                }
            }), (resultCancel => {
                this.getUsuarios(this.actual_page);
            }));

    }

    seleccionarCarrera(carrera: Carrera) {
        carrera.seleccionada = !carrera.seleccionada;
        let indiceCarrera = -1;
        let i = 0;
        this.usuarioSeleccionado.carreras.forEach(value => {
            if (value.id === carrera.id) {
                indiceCarrera = i;
            }
            i++;
        });
        if (indiceCarrera === -1) {
            this.usuarioSeleccionado.carreras.push(carrera);
        } else {
            this.usuarioSeleccionado.carreras.splice(indiceCarrera, 1);
        }

        console.log(this.usuarioSeleccionado.carreras);
    }

    llenarCarreras(usuario: User) {
        this.carreras.forEach(carrera => {
            carrera.seleccionada = false;
        });
        this.carreras.forEach(carrera => {
            usuario.carreras.forEach(carreraUsuario => {
                if (carrera.id === carreraUsuario.id) {
                    carrera.seleccionada = true;
                }
            });
        });
    }

    filter(event) {
        if (event.which === 13 || this.buscador.length === 0) {
            if (this.buscador.length === 0) {
                this.flagPagination = true;
                this.getUsuarios(1);
            } else {
                this.flagPagination = false;
                this.getUsuario();
            }
        }
    }

}
