import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ServiceService} from '../service.service';
import {Matricula} from '../modelos/matricula.model';
import {Carrera} from '../modelos/carrera.model';
import {PeriodoAcademico} from '../modelos/periodo-academico.model';
import {catalogos} from '../../../../environments/catalogos';
import {Router} from '@angular/router';
import {Estudiante} from '../modelos/estudiante.model';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {DetalleMatricula} from '../modelos/detalle-matricula.model';
import {Asignatura} from '../modelos/asignatura.model';
import {TipoMatricula} from '../modelos/tipo-matricula.model';
import {PeriodoLectivo} from '../modelos/periodo-lectivo.model';
import swal from 'sweetalert2';
import {environment} from '../../../../environments/environment';
import {Notificacion} from '../modelos/notificacion.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-cupo',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.scss']
})
export class EstudianteComponent implements OnInit {
  a = 0.1;
  spinnerConfiguracion: any;
  notificacion: Notificacion;
  erroresCargaCupos: Array<any>;
  urlExportCuposPeriodoAcademico: string;
  urlExportCuposCarrera: string;
  buscador: string;
  archivo: any;
  archivoTemp: any;
  flagAsignaturasCupo: boolean;
  // estudiantes: Array<Matricula>;
  detalleMatricula: Array<DetalleMatricula>;
  detalleMatriculaNuevo: DetalleMatricula;
  estudiantes: Array<Estudiante>;
  asignaturas: Array<Asignatura>;
  tiposMatricula: Array<TipoMatricula>;
  jornadas: Array<any>;
  paralelos: Array<any>;
  numerosMatricula: Array<any>;
  actual_page: number;
  records_per_page: number;
  total_pages: number;
  total_register: number;
  total_pages_pagination: Array<any>;
  total_pages_temp: number;
  total_detalle_matriculas_en_proceso: number;
  total_detalle_matriculas_matriculados: number;
  total_detalle_matriculas_aprobados: number;

  flagPagination: boolean;
  messages: any;
  matriculaSeleccionada: Matricula;
  carrera: Carrera;
  periodoAcademico: string;
  periodoLectivo: string;
  periodoLectivoActual: PeriodoLectivo;
  periodoLectivos: Array<PeriodoLectivo>;
  matriculados: Array<any>;
  matriculas: Array<Matricula>;
  carreras: Array<Carrera>;
  peridoAcademicos: Array<PeriodoAcademico>;
  rutaActual: string;

  constructor(private spinner: NgxSpinnerService, private service: ServiceService, private router: Router, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.spinnerConfiguracion = catalogos.spinnerConfiguracion;
    this.notificacion = new Notificacion();
    this.erroresCargaCupos = new Array<any>();
    this.flagPagination = true;
    this.total_pages_pagination = new Array<any>();
    this.total_pages_temp = 10;
    this.records_per_page = 6;
    this.actual_page = 1;
    this.total_pages = 1;
    this.paralelos = catalogos.paralelos;
    this.jornadas = catalogos.jornadas;
    this.numerosMatricula = catalogos.numerosMatricula;
    this.flagAsignaturasCupo = false;
    this.rutaActual = this.router.url;
    this.matriculaSeleccionada = new Matricula();
    this.periodoLectivoActual = new PeriodoLectivo();
    this.matriculas = new Array<Matricula>();
    this.detalleMatriculaNuevo = new DetalleMatricula();
    this.carrera = new Carrera();
    this.periodoAcademico = '';
    this.periodoLectivo = '';
    this.messages = catalogos.messages;
    this.getCarreras();
    this.getPeriodoAcademicos();
    this.getPeriodoLectivoActual();
    this.getPeriodoLectivos();
  }

  createDetalleMatricula() {
    this.spinner.show();
    this.detalleMatriculaNuevo.estado = 'EN_PROCESO';
    this.service.post('detalle_matriculas', {'detalle_matricula': this.detalleMatriculaNuevo}).subscribe(
      response => {
        this.getDetalleMatricula(this.matriculaSeleccionada);
        this.spinner.hide();
        swal.fire(this.messages['createSuccess']);
        this.detalleMatriculaNuevo = new DetalleMatricula();
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

  cambiarEstadoFlagAsignaturasCupo() {
    this.flagAsignaturasCupo = false;
    this.getCupos(this.actual_page);
    this.getDetalleMatriculasForMalla();
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

  deleteDetalleCupo(detalleMatricula: DetalleMatricula) {
    swal.fire(this.messages['deleteQuestion'])
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.service.delete('matriculas/delete_detalle_cupo?id=' + detalleMatricula.id).subscribe(
            response => {
              this.getDetalleMatricula(this.matriculaSeleccionada);
              this.spinner.hide();
              swal.fire(this.messages['deleteSuccess']);
            },
            error => {
              this.spinner.hide();
              swal.fire(this.messages['error500']);
            });
        }
      });
  }

  deleteCupo(matricula: Estudiante) {
    swal.fire(this.messages['deleteQuestion'])
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.service.delete('matriculas/cupo?id=' + matricula.id).subscribe(
            response => {
              this.getCupos(this.actual_page);
              this.spinner.hide();
              swal.fire(this.messages['deleteSuccess']);
            },
            error => {
              this.spinner.hide();
              swal.fire(this.messages['error500']);
            });
        }
      });
  }

  getAsignaturasCarrera() {
    this.service.get('matriculas/asignaturas?carrera_id=' + this.carrera.id).subscribe(
      response => {
        this.asignaturas = response['asignaturas'];
      },
      error => {
        this.spinner.hide();
        swal.fire(this.messages['error500']);
      });
  }

  getCarreras() {
    this.spinner.show();
    this.service.get('catalogos/carreras').subscribe(
      response => {
        this.carreras = response['carreras'];
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      });
  }

  getCupo(event) {
    if (event.which === 13 || this.buscador.length === 0) {
      if (this.buscador.length === 0) {
        this.flagPagination = true;
        this.getCupos(1);
      } else {
        this.flagPagination = false;
        this.total_pages = 1;
        this.crearNumerosPaginacion();
        this.buscador = this.buscador.toUpperCase();
        const parametros =
          '?identificacion=' + this.buscador
          + '&apellido1=' + this.buscador
          + '&apellido2=' + this.buscador
          + '&nombre1=' + this.buscador
          + '&nombre2=' + this.buscador
          + '&carrera_id=' + this.carrera.id;
        this.spinner.show();
        this.service.get('matriculas/cupo' + parametros).subscribe(
          response => {
            this.estudiantes = response['cupo'];
            this.spinner.hide();
            this.total_register = this.estudiantes.length;
          },
          error => {
            this.spinner.hide();
            swal.fire(this.messages['error500']);
          });
      }
    }
  }

  getCupos(page: number) {
    this.spinner.show();
    this.actual_page = page;
    const parametros = '?records_per_page=' + this.records_per_page + '&page=' + page;
    this.service.post('estudiantes/en_proceso' + parametros, null).subscribe(
      response => {
        this.estudiantes = response['estudiantes']['data'];
        this.total_pages = response['pagination']['last_page'];
        this.total_register = response['pagination']['total'];
        this.spinner.hide();
        this.crearNumerosPaginacion();

      },
      error => {
        this.spinner.hide();
      });
  }

  getDetalleMatricula(matricula: Matricula) {
    this.spinner.show();
    this.detalleMatricula = null;
    this.flagAsignaturasCupo = true;
    this.matriculaSeleccionada = matricula;
    this.getAsignaturasCarrera();
    this.getTiposMatricula();
    this.service.get('detalle_matriculas?id=' + matricula.id).subscribe(
      response => {
        this.spinner.hide();
        this.detalleMatricula = response['detalle_matricula'];
      },
      error => {
        this.spinner.hide();
        swal.fire(this.messages['error500']);
      });
  }

  getDetalleMatriculasForMalla() {
    const parametros =
      '?carrera_id=' + this.carrera.id
      + '&periodo_lectivo_id=' + this.periodoLectivoActual.id
      + '&periodo_academico_id=' + this.periodoAcademico;
    this.service.get('detalle_matriculas/count' + parametros)
      .subscribe(
        response => {
          this.total_detalle_matriculas_en_proceso = response['en_proceso_count'];
          this.total_detalle_matriculas_aprobados = response['aprobados_count'];
          this.total_detalle_matriculas_matriculados = response['matriculados_count'];
        },
        error => {
          this.spinner.hide();
        });
  }

  getPeriodoAcademicos() {

    this.service.get('catalogos/periodo_academicos').subscribe(
      response => {
        this.peridoAcademicos = response['periodo_academicos'];
      },
      error => {
        this.spinner.hide();
      });
  }

  getPeriodoLectivoActual() {
    this.service.get('periodo_lectivos/actual').subscribe(
      response => {
        this.periodoLectivoActual = response['periodo_lectivo_actual'];
      },
      error => {

      });
  }

  getPeriodoLectivos() {
    this.service.get('periodo_lectivos').subscribe(
      response => {
        this.periodoLectivos = response['periodo_lectivos'];
      },
      error => {
        this.spinner.hide();
      });
  }

  getTiposMatricula() {
    this.service.get('tipo_matriculas').subscribe(
      response => {
        this.tiposMatricula = response['tipo_matriculas'];
      },
      error => {
        this.spinner.hide();
      });
  }

  openDetalleMatricula(content) {
    this.detalleMatriculaNuevo.matricula.id = this.matriculaSeleccionada.id;
    this.modalService.open(content)
      .result
      .then((resultModal => {
        if (resultModal === 'save') {
          this.createDetalleMatricula();
        }
      }), (resultCancel => {

      }));
  }

  firstPagina() {
    this.getCupos(1);
    this.total_pages_temp = 10;
    this.crearNumerosPaginacion();
  }

  lastPagina() {
    this.getCupos(this.total_pages);
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
    this.getCupos(this.actual_page);
  }

  uploadEstudiantes(ev) {
    this.spinner.show();
    this.archivo = ev.target;
    if (this.archivo.files.length > 0) {
      const form = new FormData();
      form.append('archivo', this.archivo.files[0]);
      this.service.upload('imports/estudiantes', form).subscribe(
        response => {
          this.getCupos(1);
          this.spinner.hide();
          swal.fire('CARCA DE ESTUDIANTES',
            '<li>' + ' Estudiantes Nuevos: ' + response['total_estudiantes_nuevos'] + '</li>' +
            '<li>' + ' Estudiantes Modificados: ' + response['total_estudiantes_modificados'] + '</li>');
          this.archivoTemp = '';

          this.exportErroresCargaCupos(response['errores']);
          this.sendEmailNotificacionCargaCupos();
        },
        error => {
          this.spinner.hide();
          this.archivoTemp = '';
          swal.fire(this.messages['uploadError']);
        }
      );
    }
  }

  uploadMatriculas(ev) {
    this.spinner.show();
    this.archivo = ev.target;
    if (this.archivo.files.length > 0) {
      const form = new FormData();
      form.append('archivo', this.archivo.files[0]);
      this.service.upload('imports/matriculas', form).subscribe(
        response => {
          this.getCupos(1);
          this.spinner.hide();

        },
        error => {
          this.spinner.hide();
          alert('Error al subir el archivo');

        }
      );
    }
  }

  updateDetalleMatricula(detalleMatricula: DetalleMatricula) {
    this.spinner.show();
    this.service.update('detalle_matriculas', {'detalle_matricula': detalleMatricula})
      .subscribe(
        response => {
          this.getDetalleMatricula(this.matriculaSeleccionada);
          this.spinner.hide();
          swal.fire(this.messages['updateSuccess']);
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

  validateCupo(cupo: Estudiante) {
    swal.fire(this.messages['validateQuotaQuestion']).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.service.get('matriculas/validate_cupo?matricula_id=' + cupo.id + '&estado=APROBADO').subscribe(
          response => {
            this.getCupos(this.actual_page);
            this.spinner.hide();
            swal.fire(this.messages['validateQuotaSuccess']);
          },
          error => {
            this.spinner.hide();
            swal.fire(this.messages['validateQuotaError']);
          });
      }
    });
  }

  validateCuposCarrera() {
    swal.fire(this.messages['validateQuotaQuestion'])
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.service.get('matriculas/validate_estudiantes_carrera?carrera_id=' + this.carrera.id).subscribe(
            response => {
              this.getCupos(this.actual_page);
              this.spinner.hide();
              this.total_register = this.estudiantes.length;
              swal.fire(this.messages['validateQuotaSuccess']);
            },
            error => {
              this.spinner.hide();
              swal.fire(this.messages['validateQuotaError']);
            });
        }
      });
  }

  validateCuposPeriodoAcademico() {
    if (this.periodoAcademico !== '') {
      swal.fire(this.messages['validateQuotaQuestion'])
        .then((result) => {
          if (result.value) {
            this.spinner.show();
            this.service.get('matriculas/validate_estudiantes_periodo_academico?carrera_id=' + this.carrera.id + '&periodo_academico_id='
              + this.periodoAcademico)
              .subscribe(
                response => {
                  this.getCupos(this.actual_page);
                  this.spinner.hide();
                  this.total_register = this.estudiantes.length;
                  swal.fire(this.messages['validateQuotaSuccess']);
                },
                error => {
                  this.spinner.hide();
                  swal.fire(this.messages['validateQuotaError']);
                });
          }
        });
    } else {
      swal.fire('Seleccione un periodo académico', '', 'warning');
    }
  }

  exportCuposCarrera() {
    window.open(this.urlExportCuposCarrera);
  }

  exportCuposPeriodo() {
    if (this.periodoAcademico) {
      window.open(this.urlExportCuposPeriodoAcademico);
    } else {
      swal.fire('Seleccione un periodo', '', 'warning');
    }
  }

  deleteCuposCarrera() {
    swal.fire(this.messages['deleteQuestion'])
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.service.delete('matriculas/delete_estudiantes_carrera?carrera_id=' + this.carrera.id).subscribe(
            response => {
              this.getCupos(this.actual_page);
              this.spinner.hide();
              this.total_register = this.estudiantes.length;
              this.messages['deleteSuccess']['text'] = response['estudiantes'] + ' ' + this.messages['deleteSuccess']['text'];
              swal.fire(this.messages['deleteSuccess']);
            },
            error => {
              this.spinner.hide();
              swal.fire(this.messages['deleteError']);
            });
        }
      });

  }

  deleteCuposPeriodoAcademico() {
    if (this.periodoAcademico !== '') {
      swal.fire(this.messages['deleteQuestion'])
        .then((result) => {
          if (result.value) {
            this.spinner.show();
            this.service.delete('matriculas/delete_estudiantes_periodo_academico?carrera_id=' + this.carrera.id
              + '&periodo_academico_id=' + this.periodoAcademico)
              .subscribe(
                response => {
                  this.getCupos(this.actual_page);
                  this.spinner.hide();
                  this.total_register = this.estudiantes.length;
                  this.messages['deleteSuccess']['text'] = response['estudiantes'] + ' ' + this.messages['deleteSuccess']['text'];
                  swal.fire(this.messages['deleteSuccess']);
                },
                error => {
                  this.spinner.hide();
                  swal.fire(this.messages['deleteError']);
                });
          }
        });
    } else {
      swal.fire('Seleccione un periodo académico', '', 'warning');
    }
  }

  sendEmailNotificacionCargaCupos() {
    this.notificacion.carrera_id = this.carrera.id;
    this.notificacion.asunto = 'CARGA DE ESTUDIANTES';
    this.notificacion.body = 'Estudiantes subidos al sistema';
    this.service.post('emails', this.notificacion)
      .subscribe(
        response => {

        },
        error => {
          this.spinner.hide();
          alert('error al enviar correo');
        });
  }

  getColumns() {
    return [
      {title: 'LISTA DE ERRORES', dataKey: 'errores'},
    ];
  }

  getbodyStyles() {
    return {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontSize: 10
    };
  }

  getalternateRowStyles() {
    return {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontSize: 10
    };
  }

  exportErroresCargaCupos(errores: any) {
    const doc = new jsPDF('p', 'pt');
    const rows = [];
    let flag = false;
    if (errores['cedulas_estudiante']) {
      for (const iterator of errores['cedulas_estudiante']) {
        flag = true;
        rows.push({
          errores: iterator
        });
      }
    }
    if (errores['asignaturas']) {
      for (const iterator of errores['asignaturas']) {
        flag = true;
        rows.push({
          errores: iterator
        });
      }
    }
    if (flag) {
      doc.autoTable(this.getColumns(), rows, {
        startY: 50,
        margin: {top: 205, right: 50, left: 50, bottom: 100},
        bodyStyles: this.getbodyStyles(),
        alternateRowStyles: this.getalternateRowStyles(),
        styles: {
          cellPadding: 3,
          fontSize: 10,
          valign: 'middle',
          overflow: 'linebreak',
          lineWidth: 1,
        },
      });
      doc.save('errores_carga_cupo' + '.pdf');
      window.open(doc.output('bloburl'));
    }
  }
}
