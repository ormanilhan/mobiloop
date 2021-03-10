import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { UserConstants } from "../../constants/user.constants";
import {
    Application,
    ApplicationSettings,
    EventData,
    Switch,
} from "@nativescript/core";
import { UserService } from "../../services/user.service";
import { ToastyService } from "../../services/toasty.service";
import { MessageConstants } from "../../constants/message.constants";
import { Router } from "@angular/router";
@Component({
    selector: "login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
    userName: string;
    password: string;
    rememberMe: boolean = ApplicationSettings.hasKey(
        UserConstants.EmailAddress
    );

    constructor(
        private routerExtensions: RouterExtensions,
        private router: Router,
        private userService: UserService,
        private toastyService: ToastyService
    ) {}

    ngOnInit(): void {
        this.checkApplicationSettings();
    }

    checkApplicationSettings() {
        if (ApplicationSettings.hasKey(UserConstants.EmailAddress)) {
            this.userName = ApplicationSettings.getString(
                UserConstants.EmailAddress
            );
            this.rememberMe = true;
        }
    }

    btnLoginClicked() {
        this.userService
            .login(this.userName, this.password, this.rememberMe)
            .then(
                (isSuccess: boolean) => {
                    if (isSuccess) {
                        this.routerExtensions.navigateByUrl("activities-info", {
                            clearHistory: true,
                        });
                    } else {
                        this.toastyService.openToasty(
                            MessageConstants.WrongLoginAttempt,
                            "info"
                        );
                        this.password = "";
                    }
                },
                (error) => {
                    this.toastyService.openToasty(
                        MessageConstants.GeneralError,
                        "error"
                    );
                    console.error(error);
                }
            );
    }

    onCheckedChange(args: EventData) {
        this.rememberMe = (args.object as Switch).checked;
    }
}
