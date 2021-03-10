import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { ActivitiesInfoComponent } from "./pages/activities-info/activities-info.component";
import { LoginComponent } from "./pages/login/login.component";
import { ActivityDayComponent } from "./pages/activity-day/activity-day.component";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "activities-info", component: ActivitiesInfoComponent },
    { path: "activity-day/:day", component: ActivityDayComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
