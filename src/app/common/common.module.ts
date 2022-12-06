import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PageToolbarTitleComponent } from './page-toolbar-title/page-toolbar-title.component';
import { VehiculosSelectorComponent } from './vehiculos-selector/vehiculos-selector.component';
import { GoogleMapsComponent } from './modals/google-maps/google-maps.component';
import { HelpComponent } from './modals/help/help.component';
import { NotificationComponent } from './modals/notification/notification.component';
import { CameraComponent } from './camera/camera.component';
import { MaterialModule } from '../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { WireTransferDataComponent } from './modals/wire-transfer-data/wire-transfer-data.component';
import { DetalleServicioComponent } from './detalle-servicio/detalle-servicio.component';
import { DocsViewerComponent } from './docs-viewer/docs-viewer.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import {ServiceDetailsComponent} from './components/service-details/service-details.component';
import {SignatureCaptureComponent} from "./components/signature-capture/signature-capture.component";
import {ViewNotificationComponent} from "./modals/view-notification/view-notification.component";
import {PreSolicitudCardResumeComponent} from "./components/pre-solicitud-card-resume/pre-solicitud-card-resume.component";
import {TimecounterBarComponent} from "./components/timecounter-bar/timecounter-bar.component";
import {ReloadButtonComponent} from './components/reload-button/reload-button.component';
import {PayServiceModalComponent} from './modals/pay-service-modal/pay-service-modal.component';
import {AddCardModalComponent} from './modals/add-card-modal/add-card-modal.component';
import {NgxSpinnerModule} from 'ngx-spinner';



@NgModule({
    declarations: [
        PageToolbarTitleComponent,
        VehiculosSelectorComponent,
        GoogleMapsComponent,
        HelpComponent,
        NotificationComponent,
        CameraComponent,
        WireTransferDataComponent,
        DetalleServicioComponent,
        DocsViewerComponent,
        ServiceDetailsComponent,
        SignatureCaptureComponent,
        ViewNotificationComponent,
        PreSolicitudCardResumeComponent,
        TimecounterBarComponent,
        ReloadButtonComponent,
        PayServiceModalComponent,
        AddCardModalComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        PdfJsViewerModule,
        FormsModule,
        NgxSpinnerModule
    ],
    exports: [
        PageToolbarTitleComponent,
        VehiculosSelectorComponent,
        GoogleMapsComponent,
        HelpComponent,
        NotificationComponent,
        CameraComponent,
        WireTransferDataComponent,
        DetalleServicioComponent,
        DocsViewerComponent,
        ServiceDetailsComponent,
        SignatureCaptureComponent,
        ViewNotificationComponent,
        PreSolicitudCardResumeComponent,
        TimecounterBarComponent,
        ReloadButtonComponent,
        PayServiceModalComponent,
        AddCardModalComponent
    ]
})
export class AppCommonModule { }
