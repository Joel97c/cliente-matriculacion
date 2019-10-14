import {Component, OnInit} from '@angular/core';
import {Matricula} from '../modelos/matricula.model';
import {ServiceService} from '../service.service';
import swal from 'sweetalert2';
import kjua from 'kjua';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {catalogos} from '../../../../environments/catalogos';
import {InformacionEstudiante} from '../modelos/informacion-estudiante.model';
import {Estudiante} from '../modelos/estudiante.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {User} from '../modelos/user.model';

@Component({
    selector: 'app-perfil-estudiante',
    templateUrl: './perfil-estudiante.component.html',
    styleUrls: ['./perfil-estudiante.component.scss']
})
export class PerfilEstudianteComponent implements OnInit {
    flagInformacionEstudiante: boolean;
    errors: string;
    doc: any;
    messages: any;
    estudiante: Estudiante;
    informacionEstudiante: InformacionEstudiante;
    matricula: Matricula;
    user: User;
    tab: any;

    constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
    }

    ngOnInit() {
        this.flagInformacionEstudiante = false;
        this.messages = catalogos.messages;
        this.matricula = new Matricula();
        this.estudiante = new Estudiante();
        this.getEstudiante();
    }

    getMatricula() {
        this.service.get('matriculas/matricula').subscribe(
            response => {
                this.informacionEstudiante = response['informacion_estudiante'];
            },
            error => {
                this.spinner.hide();

            });
    }

    getEstudiante() {
        this.spinner.show();
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.service.get('estudiantes/' + this.user.id).subscribe(
            response => {
                this.estudiante = response['estudiante'];
                this.informacionEstudiante = response['informacion_estudiante'];
                this.spinner.hide();
                this.flagInformacionEstudiante = true;
            },
            error => {
                this.flagInformacionEstudiante = false;
                this.spinner.hide();
                if (error.error.errorInfo[0] === '001') {
                    swal.fire(this.messages['error001']);
                } else {
                    swal.fire(this.messages['error500']);
                }
            });
    }

    validateEstudiante(estudiante: Estudiante, informacionEstudiante: InformacionEstudiante) {
        this.errors = '';
        this.errors += '<h3>1. Datos Personales:</h3>';
        if (!estudiante.tipo_identificacion) {
            this.errors += '<li>Tipo Documento</li>';
        }
        if (!estudiante.identificacion) {
            this.errors += '<li>Identificación</li>';
        }
        if (!informacionEstudiante.categoria_migratoria) {
            this.errors += '<li>Categoria Migratoria</li>';
        }
        if (!estudiante.nombre1) {
            this.errors += '<li>Primer Nombre</li>';
        }
        if (!estudiante.apellido1) {
            this.errors += '<li>Primer Nombre</li>';
        }
        if (!estudiante.tipo_sangre) {
            this.errors += '<li>Tipo Sangre</li>';
        }
        if (!estudiante.sexo) {
            this.errors += '<li>Sexo</li>';
        }
        if (!estudiante.fecha_nacimiento) {
            this.errors += '<li>Fecha de Nacimiento</li>';
        }
        if (!estudiante.correo_institucional) {
            this.errors += '<li>Correo Institucional</li>';
        }
        if (!informacionEstudiante.codigo_postal) {
            this.errors += '<i>Código Postal</i>';
        }
        if (!informacionEstudiante.telefono_celular || !informacionEstudiante.telefono_celular) {
            this.errors += '<li>Teléfono Celular o Fijo</li>';
        }
        if (!informacionEstudiante.direccion) {
            this.errors += '<li>Dirección</li>';
        }
        if (!informacionEstudiante.estado_civil) {
            this.errors += '<li>Estado Civil</li>';
        }

        this.errors += '<hr>';
        this.errors += '<h3>2. Datos Académicos:</h3>';
        if (!estudiante.fecha_inicio_carrera) {
            this.errors += '<li>Fecha Inicio Carrera</li>';
        }
        if (!informacionEstudiante.ha_repetido_asignatura) {
            this.errors += '<li>Ha Repetido Asignaturas</li>';
        }
        if (!informacionEstudiante.ha_perdido_gratuidad) {
            this.errors += '<li>Ha Perdido la Gratuidad</li>';
        }
        if (!informacionEstudiante.ha_realizado_practicas) {
            this.errors += '<li>Ha Realizado Prácticas</li>';
        }
        if (informacionEstudiante.ha_realizado_practicas === 'SI') {
            if (!informacionEstudiante.horas_practicas) {
                this.errors += '<li>Horas Prácticas</li>';
            }
            if (!informacionEstudiante.sector_economico_practica) {
                this.errors += '<li>Sector Económico Prácticas</li>';
            }
            if (!informacionEstudiante.tipo_institucion_practicas) {
                this.errors += '<li>Tipo Institución Prácticas</li>';
            }
        }
        if (!informacionEstudiante.ha_realizado_vinculacion) {
            this.errors += '<li>Ha Realizado VInculación</li>';
        }
        if (informacionEstudiante.ha_realizado_practicas === 'SI') {
            if (!informacionEstudiante.horas_vinculacion) {
                this.errors += '<li>Horas Vinculación</li>';
            }
            if (!informacionEstudiante.alcance_vinculacion) {
                this.errors += '<li>Alcance Vinculación</li>';
            }
        }
        if (!informacionEstudiante.posee_titulo_superior) {
            this.errors += '<li>Posee Título Superior</li>';
        }
        if (!estudiante.tipo_colegio) {
            this.errors += '<li>Tipo de Colegio</li>';
        }
        if (!estudiante.tipo_bachillerato) {
            this.errors += '<li>Tipo Bachillerato</li>';
        }
        if (!estudiante.anio_graduacion) {
            this.errors += '<li>Año de Graduación del Colegio</li>';
        }

        this.errors += '<hr>';
        this.errors += '<h3>3. Datos Familiares:</h3>';
        if (!informacionEstudiante.contacto_emergencia_telefono) {
            this.errors += '<li>Contacto Emergencia Teléfono</li>';
        }
        if (!informacionEstudiante.contacto_emergencia_parentesco) {
            this.errors += '<li>Contacto Emergencia Parentesco</li>';
        }
        if (!informacionEstudiante.contacto_emergencia_nombres) {
            this.errors += '<li>Contacto Emergencia Nombres</li>';
        }
        if (!informacionEstudiante.habla_idioma_ancestral) {
            this.errors += '<li>Habla Idioma Ancestral</li>';
        }
        if (informacionEstudiante.habla_idioma_ancestral === 'SI') {
            if (!informacionEstudiante.idioma_ancestral) {
                this.errors += '<li>Idioma Ancestral</li>';
            }
        }
        if (!informacionEstudiante.ocupacion) {
            this.errors += '<li>Ocupación</li>';
        }
        if (informacionEstudiante.ocupacion === 'TRABAJA') {
            if (!informacionEstudiante.nombre_empresa_labora) {
                this.errors += '<li>Nombre de la Empresa Donde Labora</li>';
            }
        }
        if (!informacionEstudiante.destino_ingreso) {
            this.errors += '<li>Destino Ingresos</li>';
        }
        if (!informacionEstudiante.nivel_formacion_padre) {
            this.errors += '<li>Nivel Formación Padre</li>';
        }
        if (!informacionEstudiante.nivel_formacion_madre) {
            this.errors += '<li>Nivel Formación Madre</li>';
        }
        if (!informacionEstudiante.ingreso_familiar) {
            this.errors += '<li>Ingreso Familiar</li>';
        }
        if (!informacionEstudiante.numero_miembros_hogar) {
            this.errors += '<li>Número de Miembros del Hogar</li>';
        }
        if (!informacionEstudiante.tiene_discapacidad) {
            this.errors += '<li>Tiene Carnet Conadis</li>';
        }
        if (informacionEstudiante.tiene_discapacidad === '1') {
            if (!informacionEstudiante.numero_carnet_conadis) {
                this.errors += '<li>Número Carnet Conadis</li>';
            }
            if (!informacionEstudiante.tipo_discapacidad) {
                this.errors += '<li>Tipo Discapacidad</li>';
            }
            if (!informacionEstudiante.porcentaje_discapacidad) {
                this.errors += '<li>Porcentaje Discapacidad</li>';
            }
        }

        this.errors += '<hr>';
        this.errors += '<h3>4. Ubicación:</h3>';
        if (!estudiante.pais_nacionalidad) {
            this.errors += '<li>País Nacionalidad</li>';
        }
        if (!estudiante.provincia_nacimiento) {
            this.errors += '<li>Provincia Nacimiento</li>';
        }
        if (!estudiante.canton_nacimiento) {
            this.errors += '<li>Cantón Nacimiento</li>';
        }
        if (!estudiante.pais_residencia) {
            this.errors += '<li>Fecha País Residencia</li>';
        }
        if (!informacionEstudiante.provincia_residencia) {
            this.errors += '<li>Provincia Residencia</li>';
        }
        if (!informacionEstudiante.canton_residencia) {
            this.errors += '<li>Cantón Residencia</li>';
        }
        if (estudiante.etnia) {
            this.errors += '<li>Etnia</li>';
        }
        if (estudiante.etnia === 'IDÍGENA') {
            if (!estudiante.pueblo_nacionalidad) {
                this.errors += '<li>Pueblo Nacionalidad</li>';
            }
        }
    }

    getBarcodeData(text: string, size = 900) {
        return kjua({
            render: 'canvas',
            crisp: true,
            minVersion: 1,
            ecLevel: 'Q',
            size: size,
            ratio: undefined,
            fill: '#333',
            back: '#fff',
            text: text,
            rounded: 10,
            quiet: 2,
            mode: 'plain',
            mSize: 5,
            mPosX: 50,
            mPosY: 100,
            fontname: 'sans-serif',
            fontcolor: '#3F51B5',
            image: undefined
        });
    }

    generateSolicitudMatricula(datos: any, detalle: Array<any>) {
        if (this.errors === '') {
            if (datos['codigo']) {
                this.doc = new jsPDF('p', 'pt');
                const barcodeData = this.getBarcodeData(datos['codigo']);
                const logo = new Image();
                logo.src = 'assets/images/logo_carrera_1.jpg';
                this.doc.addImage(barcodeData, 'JPG', 10, 10, 100, 100);
                this.doc.addImage(logo, 'JPG', 10, 10, 500, 100);
                this.doc.setFontSize(20);
                this.doc.setFontStyle('bold');
                this.doc.text('SOLICITUD DE MATRÍCULA', 175, 100);
                this.doc.setFontStyle('times');
                this.doc.setFontSize(12);
                this.doc.text(datos['fecha'], 425, 135);
                this.doc.text('IVAN BORJA CARRERA', 70, 180);
                this.doc.text(datos['carrera'], 70, 200);
                this.doc.text('RECTOR.-', 70, 220);
                const nombresEstudiante = datos['estudiante']['nombre1'] + ' ' + datos['estudiante']['nombre2'] + ' '
                    + datos['estudiante']['apellido1'] + ' ' + datos['estudiante']['apellido2'];
                const texto = 'Yo, ' + nombresEstudiante + ', con cédula de ciudadanía N° ' + datos['estudiante']['identificacion']
                    + ', hago uso de mi cupo en la carrera ' + datos['carrera'] + ', en el periodo lectivo ' + datos['periodo_lectivo']['nombre']
                    + ' con la inscripción en las siguientes asignaturas:';
                this.doc.setFontStyle('normal');
                const splitTitle = this.doc.splitTextToSize(texto, 450);
                this.doc.text(70, 250, splitTitle);
                const rows = [];
                for (const iterator of detalle) {
                    rows.push({
                        codigo: iterator.asignatura_codigo,
                        asignatura: iterator.asignatura,
                        horas_docente: iterator.horas_docente,
                        horas_practica: iterator.horas_practica,
                        horas_autonoma: iterator.horas_autonoma,
                        periodo: iterator.periodo
                    });
                }
                this.doc.autoTable(this.getColumns(), rows, {
                    startY: 350,
                    margin: {top: 205, right: 70, left: 70, bottom: 100},
                    bodyStyles: this.getbodyStyles(),
                    alternateRowStyles: this.getalternateRowStyles(),
                    headerStyles: this.getheaderStyles(),
                    styles: {
                        cellPadding: 1,
                        fontSize: 8,
                        valign: 'middle',
                        overflow: 'linebreak',
                        tableWidth: 'auto',
                        lineWidth: 1,
                    },
                }); // generando
                this.doc.text('Con sentimiento de distinguida consideración.', 70, 630);
                this.doc.text('Atentamente,', 70, 700);
                this.doc.text(nombresEstudiante, 70, 730);
                this.doc.text('C.C. ' + datos['estudiante']['identificacion'], 70, 760);

                this.doc.save('CERTIFICADO-' + nombresEstudiante + '.pdf');
            }
        } else {
            swal.fire('Falta la siguiente información:', this.errors, 'error');
        }
    }

    getCertificadoMatricula(matricula: Matricula) {
        this.service.get('matriculas/solicitud_matricula?user_id=' + this.user.id).subscribe(
            response => {
                this.generateSolicitudMatricula(response['certificado'][0], response['certificado']);
            },
            error => {
                this.spinner.hide();
                swal.fire(this.messages['error500']);
            });
    }

    getColumns() {
        return [
            {title: 'CÓDIGO', dataKey: 'codigo'},
            {title: 'ASIGNATURA', dataKey: 'asignatura'},
            {title: 'PERIODO', dataKey: 'periodo'},
            {title: 'H. DOCENTE', dataKey: 'horas_docente'},
            {title: 'H. PRÁCTICA', dataKey: 'horas_practica'},
            {title: 'H. AUTÓNOMA', dataKey: 'horas_autonoma'},
        ];

    }

    getheaderStyles() {
        const headerStyle = {
            fillColor: [255, 255, 255],
            textColor: 0,
            fontSize: 8
        };
        return headerStyle;
    }

    getbodyStyles() {
        const bodyStyle = {
            fillColor: [255, 255, 255],
            textColor: 0,
            fontSize: 8
        };
        return bodyStyle;
    }

    getalternateRowStyles() {
        const alternateRowStyle = {
            fillColor: [255, 255, 255],
            textColor: 0,
            fontSize: 8
        };
        return alternateRowStyle;
    }

    updateFecha(event) {
        if (event.nextId === 'tab4') {
            this.service.update('matriculas/fecha_formulario', {'usuario': this.user.id}).subscribe(
                response => {

                },
                error => {

                });
        }
        if (event.nextId === 'tab5') {
            this.service.update('matriculas/fecha_solicitud', {'usuario': this.user.id}).subscribe(
                response => {

                },
                error => {

                });
        }
    }

}
