import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {AjusteRoutingModule} from './ajuste-routing.module';
import {AjusteComponent} from './ajuste.component';
import {Seccion1Component} from './seccion1/seccion1.component';
import {Seccion2Component} from './seccion2/seccion2.component';
import {Seccion3Component} from './seccion3/seccion3.component';
import {SolicitudComponent} from './solicitud/solicitud.component';
import {FormularioComponent} from './formulario/formulario.component';


@NgModule({
  imports: [CommonModule, AjusteRoutingModule, NgbModule, FormsModule],
  declarations: [
    AjusteComponent,
    Seccion1Component,
    Seccion2Component,
    Seccion3Component,
    SolicitudComponent,
    FormularioComponent,
  ]
})
export class AjusteModule {
}
