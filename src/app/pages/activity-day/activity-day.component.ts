import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { ActivityService } from "../../services/activity.service";
import { Activity } from "../../models/activity.model";
import { ToastyService } from "../../services/toasty.service";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { Subscription } from "rxjs";
import { MessageConstants } from "../../constants/message.constants";
import { RouterExtensions } from "@nativescript/angular";
import { HttpCallService } from "../../services/http-call.service";

@Component({
    selector: "activity-day",
    templateUrl: "./activity-day.component.html",
    styleUrls: ["./activity-day.component.css"],
})
export class ActivityDayComponent implements OnInit, OnDestroy {
    currentDay: string;

    get currentActivities(): Activity[] {
        return this.activityService.activies[this.currentDay];
    }

    private paramSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private routerExtensions: RouterExtensions,
        private activityService: ActivityService,
        private toastyService: ToastyService,
        private httpCallService: HttpCallService
    ) {
        this.paramSubscription = this.route.params.subscribe((params) => {
            this.currentDay = params["day"];
            if (_.isEmpty(this.activityService.activies[this.currentDay])) {
                this.activityService.activies[this.currentDay] = [];
                this.activityService.activies[this.currentDay].push(
                    new Activity(this.currentDay)
                );
            }
        });
    }

    removeActivity() {
        if (this.activityService.activies[this.currentDay].length > 1) {
            this.activityService.activies[this.currentDay].pop();
        }
    }

    ngOnDestroy(): void {
        if (this.paramSubscription) {
            this.paramSubscription.unsubscribe();
        }
    }

    addActivity() {
        if (this.isActivitiesValid()) {
            this.activityService.activies[this.currentDay].push(
                new Activity(this.currentDay)
            );
        } else {
            this.toastyService.openToasty(
                MessageConstants.FillTheOthers,
                "info"
            );
        }
    }

    saveActivities() {
        if (this.checkActivities()) {
            this.sendActivities();
        }
    }

    private sendActivities() {
        this.httpCallService.isBusy = true;
        const editedActivities = this.editActivities();
        this.activityService
            .saveActivities(editedActivities)
            .then(
                () => {
                    delete this.activityService.activies[this.currentDay];
                    this.toastyService.openToasty(
                        MessageConstants.ActivityAdded,
                        "success"
                    );
                    this.activityService.getMissingDays().finally(() => {
                        this.routerExtensions.backToPreviousPage();
                    });
                },
                (errorMessage) => {
                    this.toastyService.openToasty(errorMessage, "warning");
                }
            )
            .finally(() => {
                this.httpCallService.isBusy = false;
            });
    }

    private editActivities(): Activity[] {
        const editedActivities = _.cloneDeep(
            this.activityService.activies[this.currentDay]
        );
        _.forEach(editedActivities, (val) => {
            delete val.IsValid;
            const activityTime = _.toNumber(val.Hour);
            if (activityTime > 4) {
                let cloneActivity = _.cloneDeep(val);
                cloneActivity.Hour =
                    activityTime == 8 ? "4" : _.toString(activityTime % 4);
                editedActivities.push(cloneActivity);
                val.Hour = "4";
            }
        });
        return editedActivities;
    }

    checkActivities(): boolean {
        const isActivitiesValid = this.isActivitiesValid();
        const isActivityTimesEnough = this.isActivityTimesEnough();

        if (isActivitiesValid && isActivityTimesEnough) {
            return true;
        } else {
            let warningMessage = "";

            if (!isActivitiesValid) {
                warningMessage += MessageConstants.CheckYourActivities;
            }

            if (!isActivityTimesEnough) {
                warningMessage += MessageConstants.MinimumHour;
            }

            this.toastyService.openToasty(warningMessage, "warning");
            return false;
        }
    }

    isActivitiesValid() {
        return _.every(this.activityService.activies[this.currentDay], {
            IsValid: true,
        });
    }

    isActivityTimesEnough() {
        let totalHour: number = 0;
        _.forEach(this.activityService.activies[this.currentDay], (val) => {
            totalHour += _.toNumber(val.Hour);
        });
        return totalHour >= 4;
    }

    ngOnInit(): void {}
}
