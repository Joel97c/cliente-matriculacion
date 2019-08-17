import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ServiceService} from '../../../matriculacion/service.service';
import {Matricula} from '../../../matriculacion/modelos/matricula.model';
import {Carrera} from '../../../matriculacion/modelos/carrera.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {User} from '../../../matriculacion/modelos/user.model';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-dashboard-matricula',
  templateUrl: './dashboard-matricula.component.html',
  styleUrls: ['./dashboard-matricula.component.scss']
})
export class DashboardMatriculaComponent implements OnInit {
  total_matriculados_carreras_count: Array<any>;
  total_matriculados_institutos_count: Array<any>;
  user: User;
  chart = [];
  etiquetaCanvas: Array<any>;
  flagGraficos: boolean;
  classContadorMatriculados: string;
  classContadorAprobados: string;
  classContadorEnProceso: string;
  @ViewChildren('graficosCarreras') graficosCarreras: QueryList<any>;
  @ViewChildren('graficosInstitutos') graficosInstitutos: QueryList<any>;

  constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
  }

  ngOnInit() {

  }


}
