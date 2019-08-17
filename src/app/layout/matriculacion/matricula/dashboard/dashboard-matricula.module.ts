import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbCarouselModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

import {DashboardMatriculaRoutingModule} from './dashboard-matricula-routing.module';
import {DashboardMatriculaComponent} from './dashboard-matricula.component';


@NgModule({
  imports: [
    CommonModule,
    NgbCarouselModule,
    NgbAlertModule,
    DashboardMatriculaRoutingModule
  ],
  declarations: [
    DashboardMatriculaComponent
  ]
})
export class DashboardMatriculaModule {
}
