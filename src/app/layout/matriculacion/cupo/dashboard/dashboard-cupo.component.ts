import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ServiceService} from '../../../matriculacion/service.service';
import {Chart} from 'chart.js';
import {NgxSpinnerService} from 'ngx-spinner';
import {User} from '../../../matriculacion/modelos/user.model';

@Component({
    selector: 'app-dashboard-cupo',
    templateUrl: './dashboard-cupo.component.html',
    styleUrls: ['./dashboard-cupo.component.scss']
})
export class DashboardCupoComponent implements OnInit {
    total_matriculados_carreras_count: Array<any>;
    total_matriculados_institutos_count: Array<any>;
    user: User;
    chart = [];
    etiquetaCanvas: Array<any>;
    flagGraficos: boolean;
    @ViewChildren('graficosCarreras') graficosCarreras: QueryList<any>;
    @ViewChildren('graficosInstitutos') graficosInstitutos: QueryList<any>;

    constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
    }

    ngOnInit() {

    }
}
