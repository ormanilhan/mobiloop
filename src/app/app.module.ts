import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "@nativescript/angular";
import {
    NativeScriptFormsModule,
    NativeScriptHttpClientModule,
} from "@nativescript/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LayoutComponent } from "./components/layout/layout.component";
import { ActivityInputComponent } from "./components/activity-input/activity-input.component";
import { ActivitiesInfoComponent } from "./pages/activities-info/activities-info.component";
import { ActivityDayComponent } from "./pages/activity-day/activity-day.component";
import { LoginComponent } from "./pages/login/login.component";
import { HttpCallService } from "./services/http-call.service";
import { UserService } from "./services/user.service";
import { ActivityService } from "./services/activity.service";
import { ToastyService } from "./services/toasty.service";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { DropDownModule } from "nativescript-drop-down/angular";
@NgModule({
    bootstrap: [AppComponent],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
        NativeScriptUIDataFormModule,
        DropDownModule,
    ],
    declarations: [
        AppComponent,
        LayoutComponent,
        LoginComponent,
        ActivitiesInfoComponent,
        ActivityInputComponent,
        ActivityDayComponent,
    ],
    providers: [HttpCallService, UserService, ActivityService, ToastyService],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
