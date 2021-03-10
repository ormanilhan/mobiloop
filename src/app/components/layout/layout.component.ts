import { Component, ElementRef, ViewChild } from "@angular/core";
import { UserService } from "../../services/user.service";
import { HttpCallService } from "../../services/http-call.service";

@Component({
    selector: "app-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.css"],
})
export class LayoutComponent {
    constructor(
        private httpCallService: HttpCallService,
        private userService: UserService
    ) {}

    get isBusy(): boolean {
        return this.httpCallService.isBusy;
    }

    get isLoggedIn(): boolean {
        return this.userService.isLoggedIn;
    }

    get fullName(): string {
        return this.userService.fullName;
    }
}
