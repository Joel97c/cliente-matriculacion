import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {EstudianteRoutingModule} from './estudiante-routing.module';
import {EstudianteComponent} from './estudiante.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';


@NgModule({
  imports: [CommonModule, EstudianteRoutingModule, FormsModule, PdfViewerModule],
  declarations: [EstudianteComponent]
})
export class EstudianteModule {
}
