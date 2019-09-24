import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ServiceService} from '../../../matriculacion/service.service';
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
    total_matriculados_institutos: number;
    user: User;
    chart = [];
    etiquetaCanvas: Array<any>;
    flagGraficos: boolean;
    classContadorMatriculados: string;
    classContadorAprobados: string;
    classContadorEnProceso: string;
    classContadorDesertores: string;
    classContadorAnulados: string;
    classContadorParalelos: string;
    @ViewChildren('graficosCarreras') graficosCarreras: QueryList<any>;
    @ViewChildren('graficosInstitutos') graficosInstitutos: QueryList<any>;

    constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
    }

    ngOnInit() {
        this.total_matriculados_institutos = 0;
        // this.classContadorMatriculados = 'text-success';
        // this.classContadorAprobados = 'text-warning text-white';
        // this.classContadorEnProceso = 'text-danger';

        this.classContadorMatriculados = 'btn btn-success btn-sm';
        this.classContadorAprobados = 'btn btn-info btn-sm text-white ml-2';
        this.classContadorEnProceso = 'btn btn-secondary btn-sm ml-2';
        this.classContadorDesertores = 'btn btn-danger btn-sm ml-2';
        this.classContadorAnulados = 'btn btn-warning text-white btn-sm ml-2';
        this.classContadorParalelos = 'btn btn-sm ml-2';

        // this.classContadorMatriculados = 'btn btn-link btn-sm';
        // this.classContadorAprobados = 'btn btn-link btn-sm ml-2';
        // this.classContadorEnProceso = 'btn btn-link btn-sm ml-2';
//
//         this.classContadorMatriculados = 'btn btn-dark btn-sm';
//         this.classContadorAprobados = 'btn btn-dark btn-sm ml-2';
//         this.classContadorEnProceso = 'btn btn-dark btn-sm ml-2';

        this.flagGraficos = true;
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.total_matriculados_carreras_count = new Array<any>();
        this.total_matriculados_institutos_count = new Array<any>();
        this.getMatriculadosCount();
    }

    getMatriculadosCount() {
        this.flagGraficos = !this.flagGraficos;
        this.spinner.show();
        const parametros =
            '?id=' + this.user.id
            + '&periodo_lectivo_id=' + 5;

        this.service.get('matriculas/count' + parametros)
            .subscribe(
                response => {
                    this.total_matriculados_carreras_count = response['matriculados_carreras_count'];
                    this.total_matriculados_institutos_count = response['matriculados_institutos_count'];
                    this.total_matriculados_institutos_count.forEach(value => {
                        this.total_matriculados_institutos += value.total_matriculados;
                    });
                    this.spinner.hide();
                },
                error => {
                    this.spinner.hide();
                });
    }
}
