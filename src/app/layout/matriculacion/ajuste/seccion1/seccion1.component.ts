import {Component, OnInit} from '@angular/core';
import {ServiceService} from '../../service.service';
import {Estudiante} from '../../modelos/estudiante.model';
import {Ubicacion} from '../../modelos/ubicacion.model';
import {catalogos} from '../../../../../environments/catalogos';
import {InformacionEstudiante} from '../../modelos/informacion-estudiante.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {Instituto} from '../../modelos/instituto.model';
import {Carrera} from '../../modelos/carrera.model';
import {User} from '../../modelos/user.model';
import {PeriodoLectivo} from '../../modelos/periodo-lectivo.model';
import swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DetalleMatricula} from '../../modelos/detalle-matricula.model';

@Component({
    selector: 'app-seccion1',
    templateUrl: './seccion1.component.html',
    styleUrls: ['./seccion1.component.scss']
})
export class Seccion1Component implements OnInit {
    constructor(private spinner: NgxSpinnerService, private service: ServiceService, private modalService: NgbModal) {
    }

    periodosLectivos: Array<PeriodoLectivo>;
    periodoLectivoSeleccionado: PeriodoLectivo;
    messages: any;

    ngOnInit() {
        this.periodosLectivos = new Array<PeriodoLectivo>();
        this.periodoLectivoSeleccionado = new PeriodoLectivo();
        this.messages = catalogos.messages;
        this.getPeriodosLectivos();
    }

    getPeriodosLectivos() {
        this.spinner.show();
        this.service.get('periodo_lectivos').subscribe(
            response => {
                this.periodosLectivos = response['periodos_lectivos'];
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }

    openPeriodoLectivo(content, periodoLectivo) {
        if (periodoLectivo != null) {
            this.periodoLectivoSeleccionado = periodoLectivo;
        } else {
            this.periodoLectivoSeleccionado = new PeriodoLectivo();
        }
        this.modalService.open(content)
            .result
            .then((resultModal => {
                if (resultModal === 'save') {
                    if (periodoLectivo == null) {
                        this.createPeriodoLectivo();
                    } else {
                        this.updatePeriodoLectivo(periodoLectivo);
                    }
                }
            }), (resultCancel => {

            }));

    }

    createPeriodoLectivo() {
        this.spinner.show();
        this.periodoLectivoSeleccionado.codigo = this.periodoLectivoSeleccionado.fecha_inicio_periodo.toString().substring(0, 4)
            + '-' + this.periodoLectivoSeleccionado.codigo;
        this.service.post('periodo_lectivos', {'periodo_lectivo': this.periodoLectivoSeleccionado}).subscribe(
            response => {
                this.getPeriodosLectivos();
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

    updatePeriodoLectivo(periodoLectivo: PeriodoLectivo) {
        this.spinner.show();
        this.service.post('periodo_lectivos', {'periodo_lectivo': periodoLectivo}).subscribe(
            response => {
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
}
