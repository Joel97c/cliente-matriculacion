import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatriculaRoutingModule} from './matricula-routing.module';
import {MatriculaComponent} from './matricula.component';


@NgModule({
  imports: [FormsModule, CommonModule, MatriculaRoutingModule],
  declarations: [MatriculaComponent]
})
export class MatriculaModule {
}
