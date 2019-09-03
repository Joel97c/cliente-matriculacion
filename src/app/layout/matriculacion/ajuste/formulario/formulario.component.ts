import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ServiceService} from '../../service.service';
import {Estudiante} from '../../modelos/estudiante.model';
import {Ubicacion} from '../../modelos/ubicacion.model';
import {catalogos} from '../../../../../environments/catalogos';
import {InformacionEstudiante} from '../../modelos/informacion-estudiante.model';
import {NgxSpinnerService} from 'ngx-spinner';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import {Matricula} from '../../modelos/matricula.model';
import {Carrera} from '../../modelos/carrera.model';
import {Instituto} from '../../modelos/instituto.model';
import {User} from '../../modelos/user.model';

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
    styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {
    @ViewChild('encabezadoHojaVida', null) encabezadoHojaVida: ElementRef;
    @ViewChild('cuerpoHojaVida1', null) cuerpoHojaVida1: ElementRef;
    @ViewChild('pieHojaVida1', null) pieHojaVida1: ElementRef;
    @ViewChild('cuerpoHojaVida2', null) cuerpoHojaVida2: ElementRef;
    @ViewChild('pieHojaVida2', null) pieHojaVida2: ElementRef;

    constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
        this.spinnerConfiguracion = catalogos.spinnerConfiguracion[0];

    }

    edad: number;
    spinnerConfiguracion: any;
    matricula: Matricula;
    instituto: Instituto;
    carrera: Carrera;
    estudiante: Estudiante;
    informacionEstudiante: InformacionEstudiante;
    paisesNacionalidad: Array<Ubicacion>;
    paisesResidencia: Array<Ubicacion>;
    tiposIdentificacion: Array<any>;
    tiposInstituciones: Array<any>;
    tiposColegio: Array<any>;
    tiposBachillerato: Array<any>;
    sectoresEconomicos: Array<any>;
    alcancesVinculacion: Array<any>;
    opcionesSiNo: Array<any>;
    opcionesSiNoNA: Array<any>;
    ocupacionesEstudiante: Array<any>;
    destinosIngreso: Array<any>;
    nivelesFormacion: Array<any>;
    tiposSangre: Array<any>;
    ubicacionNacimiento: any;
    ubicacionResidencia: any;
    categoriasMigratoria: Array<any>;
    estadosCivil: Array<any>;
    tiposDiscapacidad: Array<any>;
    sexos: Array<any>;
    generos: Array<any>;
    etnias: Array<any>;
    pueblosNacionalidad: Array<any>;
    jornadas: Array<any>;
    paralelos: Array<any>;
    semestres: Array<any>;
    user: User;
    flagFormulario: boolean;

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.flagFormulario = false;
        this.ubicacionNacimiento = '';
        this.ubicacionResidencia = '';
        this.matricula = new Matricula();
        this.instituto = new Instituto();
        this.carrera = new Carrera();
        this.informacionEstudiante = new InformacionEstudiante();
        this.jornadas = catalogos.jornadas;
        this.pueblosNacionalidad = catalogos.pueblosNacionalidad;
        this.tiposInstituciones = catalogos.tiposInstituciones;
        this.tiposColegio = catalogos.tiposColegio;
        this.etnias = catalogos.etnias;
        this.sexos = catalogos.sexos;
        this.generos = catalogos.generos;
        this.opcionesSiNo = catalogos.opcionesSiNo;
        this.opcionesSiNoNA = catalogos.opcionesSiNoNA;
        this.tiposIdentificacion = catalogos.tiposIdentificacion;
        this.ocupacionesEstudiante = catalogos.ocupacionesEstudiante;
        this.tiposBachillerato = catalogos.tiposBachillerato;
        this.sectoresEconomicos = catalogos.sectoresEconomicos;
        this.alcancesVinculacion = catalogos.alcancesVinculacion;
        this.destinosIngreso = catalogos.destinosIngreso;
        this.nivelesFormacion = catalogos.nivelesFormacion;
        this.tiposSangre = catalogos.tiposSangre;
        this.categoriasMigratoria = catalogos.categoriasMigratoria;
        this.estadosCivil = catalogos.estadosCivil;
        this.tiposDiscapacidad = catalogos.tiposDiscapacidad;
        this.semestres = catalogos.semestres;
        this.paralelos = catalogos.paralelos;
        this.getFormulario();
    }

    updateEstudiante(): void {
        this.service.update('estudiantes/update_perfil',
            {'estudiante': this.estudiante, 'informacion_estudiante': this.informacionEstudiante})
            .subscribe(
                response => {
                    this.getEstudiante();
                },
                error => {
                    this.spinner.hide();

                });
    }

    getFormulario() {
        this.spinner.show();
        this.service.get('estudiantes/formulario/' + this.user.id).subscribe(
            response => {
                this.spinner.hide();
                this.flagFormulario = true;
                this.matricula = response['matricula'];
                console.log(this.matricula.fecha_formulario);
                this.informacionEstudiante = response['informacion_estudiante'];
                this.instituto = response['instituto'];
                this.carrera = response['carrera'];
                this.ubicacionNacimiento = response['ubicacion_nacimiento'][0];
                this.ubicacionResidencia = response['ubicacion_residencia'][0];
                this.calculateEdad(response['matricula']['estudiante']['fecha_nacimiento']);
            },
            error => {
                this.spinner.hide();
            });
    }

    getEstudiante() {
        this.spinner.show();
        this.service.get('estudiantes/3').subscribe(
            response => {
                this.estudiante = response['estudiante'];
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
                // if (error.status === 401) {
                //   swal({
                //     position: this.messages['createError401']['position'],
                //     type: this.messages['createError401']['type'],
                //     title: this.messages['createError401']['title'],
                //     text: this.messages['createError401']['text'],
                //     showConfirmButton: this.messages['createError401']['showConfirmButton'],
                //     backdrop: this.messages['createError401']['backdrop']
                //   });
                // }
            });
    }

    getPaisesNacionalidad() {
        this.service.get('paises_nacionalidad').subscribe(
            response => {
                this.paisesNacionalidad = response['paises_nacionalidad'];
            },
            error => {
                this.spinner.hide();

            });
    }

    getPaisesResidencia() {
        this.service.get('paises_residencia').subscribe(
            response => {
                this.paisesNacionalidad = response['paises_residencia'];
            },
            error => {
                this.spinner.hide();

            });
    }

    validarPracticas() {

    }

    validarVinculacion() {
    }

    validateTituloSuperior() {
        this.informacionEstudiante.titulo_superior_obtenido = '';
    }

    validateOcupacion() {
        this.informacionEstudiante.nombre_empresa_labora = '';
        this.informacionEstudiante.area_trabajo_empresa = '';
        this.informacionEstudiante.destino_ingreso = '';
    }

    imprimir2() {
        // return xepOnline.Formatter.Format('formulario1', {
        //     render: 'download',
        //     filename: 'PDF'
        // });
    }

    imprimir() {
        this.spinner.show();
        html2canvas(this.encabezadoHojaVida.nativeElement).then(canvasEncabezado => {
            const encabezadoHojaDatosImg = canvasEncabezado.toDataURL('image/png');
            html2canvas(this.cuerpoHojaVida1.nativeElement).then(canvasCuerpo1 => {
                const cuerpoHojaDatosImg1 = canvasCuerpo1.toDataURL('image/png');
                html2canvas(this.pieHojaVida1.nativeElement).then(canvasPie1 => {
                    const pieHojaDatosImg1 = canvasPie1.toDataURL('image/png');
                    html2canvas(this.cuerpoHojaVida2.nativeElement).then(canvasCuerpo2 => {
                        const cuerpoHojaDatosImg2 = canvasCuerpo2.toDataURL('image/png');
                        html2canvas(this.pieHojaVida2.nativeElement).then(canvasPie2 => {
                            const pieHojaDatosImg2 = canvasPie2.toDataURL('image/png');
                            const doc = new jsPDF();
                            doc.addImage(encabezadoHojaDatosImg, 'PNG', 10, 10, 190, 25);
                            doc.addImage(cuerpoHojaDatosImg1, 'PNG', 20, 40, 165, 230);
                            doc.addImage(pieHojaDatosImg1, 'PNG', 10, 280, 180, 5);
                            doc.addPage();
                            doc.addImage(encabezadoHojaDatosImg, 'PNG', 10, 10, 190, 30);
                            doc.addImage(cuerpoHojaDatosImg2, 'PNG', 20, 40, 165, 230);
                            doc.addImage(pieHojaDatosImg2, 'PNG', 10, 280, 180, 10);
                            const nombresEstudiante = this.matricula.estudiante.apellido1 + ' ' + this.matricula.estudiante.apellido2
                                + ' ' + this.matricula.estudiante.nombre1 + ' ' + this.matricula.estudiante.nombre2;
                            doc.save('FORMULARIO-MATRICULA-' + nombresEstudiante + '-' + this.matricula.estudiante.identificacion + '.pdf');
                            // doc.autoPrint();
                            window.open(doc.output('bloburl'));
                            this.spinner.hide();
                        });
                    });
                });
            });
        });
    }

    calculateEdad(fechaNacimiento) {
        if (fechaNacimiento != null && fechaNacimiento !== '') {
            const fecha_nacimiento = new Date(fechaNacimiento + ' GMT-0500');
            const ano = fecha_nacimiento.getFullYear();
            const mes = fecha_nacimiento.getMonth();
            const dia = fecha_nacimiento.getDay();
            const fecha_hoy = new Date();
            const ahora_ano = fecha_hoy.getFullYear();
            const ahora_mes = fecha_hoy.getMonth();
            const ahora_dia = fecha_hoy.getDate();
            let edad = (ahora_ano + 1900) - ano;

            if (ahora_mes < (mes - 1)) {
                edad--;
            }
            if (((mes - 1) === ahora_mes) && (ahora_dia < dia)) {
                edad--;
            }
            if (edad > 1900) {
                edad -= 1900;
            }

            this.edad = edad;
        }


    }
}
