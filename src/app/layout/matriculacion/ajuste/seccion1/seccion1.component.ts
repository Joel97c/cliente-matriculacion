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

@Component({
  selector: 'app-seccion1',
  templateUrl: './seccion1.component.html',
  styleUrls: ['./seccion1.component.scss']
})
export class Seccion1Component implements OnInit {
  constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
  }

  ubicacionNacimiento: any;
  ubicacionResidencia: any;
  estadoDatos: string;
  instituto: Instituto;
  carrera: Carrera;
  estudiante: Estudiante;
  informacionEstudiante: InformacionEstudiante;
  paises: Array<Ubicacion>;
  provincias: Array<Ubicacion>;
  cantones: Array<Ubicacion>;
  sexos: Array<any>;
  generos: Array<any>;
  etnias: Array<any>;
  estadosCiviles: Array<any>;
  tiposDocumentos: Array<any>;
  tiposSangre: Array<any>;
  tiposDiscapacidad: Array<any>;
  user: User;

  ngOnInit() {
    this.estadoDatos = '';
    this.user = JSON.parse(localStorage.getItem('user')) as User;
    this.estudiante = new Estudiante();
    this.informacionEstudiante = new InformacionEstudiante();
    this.sexos = catalogos.sexos;
    this.tiposDiscapacidad = catalogos.tiposDiscapacidad;
    this.tiposDocumentos = catalogos.tiposIdentificacion;
    this.generos = catalogos.generos;
    this.tiposSangre = catalogos.tiposSangre;
    this.etnias = catalogos.etnias;
    this.estadosCiviles = catalogos.estadosCivil;
    this.getEstudianteLoad();
    this.getPaises();
    this.getProvincias();

  }

  updateEstudiante(): void {
    this.service.update('estudiantes/update_perfil',
      {'estudiante': this.estudiante, 'informacion_estudiante': this.informacionEstudiante})
      .subscribe(
        response => {
          this.getEstudiante();
        },
        error => {
          this.getEstudiante();
        });
  }

  getEstudianteLoad() {
    this.spinner.show();
    this.service.get('estudiantes/' + this.user.id).subscribe(
      response => {
        this.estudiante = response['estudiante'];
        this.informacionEstudiante = response['informacion_estudiante'];
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

  getEstudiante() {
    // this.spinner.show();
    this.estadoDatos = 'Guardando...';
    this.service.get('estudiantes/' + this.user.id).subscribe(
      response => {
        this.estudiante = response['estudiante'];
        this.informacionEstudiante = response['informacion_estudiante'];
        this.estadoDatos = '';
        // this.spinner.hide();
      },
      error => {
        this.estadoDatos = '';
        // this.spinner.hide();
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

  getPaises() {
    this.service.get('catalogos/paises').subscribe(
      response => {
        this.paises = response['paises'];

      },
      error => {


      });
  }

  getProvincias() {
    this.service.get('catalogos/provincias').subscribe(
      response => {
        this.provincias = response['provincias'];

      },
      error => {

      });
  }

  getCantones(idProvincia: number) {
    this.service.get('catalogos/cantones?provincia_id=' + idProvincia).subscribe(
      response => {
        this.cantones = response['cantones'];

      },
      error => {


      });
  }

  validateTipoIdentificacion() {
//    this.estudiante.identificacion = null;
  }
}
