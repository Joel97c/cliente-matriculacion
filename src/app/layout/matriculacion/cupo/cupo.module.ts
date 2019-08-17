import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CupoRoutingModule} from './cupo-routing.module';
import {CupoComponent} from './cupo.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';


@NgModule({
  imports: [CommonModule, CupoRoutingModule, FormsModule, PdfViewerModule],
  declarations: [CupoComponent]
})
export class CupoModule {
}
