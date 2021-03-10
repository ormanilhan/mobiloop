import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { HttpCallService } from "../../services/http-call.service";
import { ActivityService } from "../../services/activity.service";
import { ToastyService } from "../../services/toasty.service";
import { UserService } from "../../services/user.service";
import { MessageConstants } from "../../constants/message.constants";
import { RouterExtensions } from "@nativescript/angular";
import * as _ from "lodash";
@Component({
    selector: "activities-info",
    templateUrl: "./activities-info.component.html",
    styleUrls: ["./activities-info.component.css"],
})
export class ActivitiesInfoComponent implements OnInit {
    fullName: string;

    get hasMissingDay(): boolean {
        return this.activityService.hasMissingDay;
    }

    get isBusy(): boolean {
        return this.httpCallService.isBusy;
    }

    get noMissingDayMessage(): string {
        return MessageConstants.NoMissingDay;
    }

    get missingDaysTitle(): string {
        return MessageConstants.MissingDaysTitle;
    }

    constructor(
        private httpCallService: HttpCallService,
        private userService: UserService,
        private routerExtensions: RouterExtensions,
        private toastyService: ToastyService,
        private activityService: ActivityService
    ) {
        this.fullName = this.userService.fullName;
    }

    get missingDaysList(): string[] {
        return this.activityService.missingDaysList;
    }

    routeActivity(day: string) {
        const index = _.findIndex(
            this.activityService.missingDaysList,
            (val) => {
                return val == day;
            }
        );

        if (index == 0) {
            this.routerExtensions.navigateByUrl(`/activity-day/${day}`);
        } else {
            this.toastyService.openToasty(
                MessageConstants.MissingDaysInPast,
                "info"
            );
        }
    }

    ngOnInit(): void {
        this.httpCallService.isBusy = true;
        this.activityService.getMissingDays().finally(() => {
            this.httpCallService.isBusy = false;
        });
    }
}
