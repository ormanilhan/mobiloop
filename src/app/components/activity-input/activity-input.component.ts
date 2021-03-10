import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivityService } from "../../services/activity.service";
import { Activity, KeyValuePair } from "../../models/activity.model";
import {
    SelectedIndexChangedEventData,
    ValueList,
} from "nativescript-drop-down";
import * as _ from "lodash";
import { HttpCallService } from "../../services/http-call.service";
import { RouterExtensions } from "@nativescript/angular";
import { ToastyService } from "../../services/toasty.service";
import { MessageConstants } from "../../constants/message.constants";
import { EventData, TextView } from "@nativescript/core";

@Component({
    selector: "Activity-Input",
    templateUrl: "./activity-input.component.html",
    styleUrls: ["./activity-input.component.css"],
})
export class ActivityInputComponent implements OnInit {
    @Input("activity-info") currentActivity: Activity;

    isProjectSelectActive: boolean = false;
    isSubProjectSelectActive: boolean = false;
    isCustomerSelectActive: boolean = false;

    selectedCustomer: number;
    selectedProject: number;
    selectedSubProject: number;
    selectedActivityType: number;
    selectedHour: number;

    subProjectList: ValueList<string>;

    get hourSelections(): string[] {
        return this.activityService.hourSelections;
    }

    get activityTypeList(): ValueList<string> {
        return this.activityService.activityTypeList;
    }

    get customerTypeList(): ValueList<string> {
        return this.activityService.customerTypeList;
    }

    get projectList(): ValueList<string> {
        return this.activityService.projectList;
    }

    constructor(
        private activityService: ActivityService,
        private httpCallService: HttpCallService,
        private routerExtensions: RouterExtensions,
        private toastyService: ToastyService
    ) {}

    ngOnInit(): void {
        this.httpCallService.isBusy = true;
        this.currentActivity.IsValid = false;
        this.activityService
            .getActivityTypes()
            .then(
                () => {},
                () => {
                    this.toastyService.openToasty(
                        MessageConstants.GeneralError,
                        "error"
                    );
                    this.routerExtensions.backToPreviousPage();
                }
            )
            .finally(() => {
                this.httpCallService.isBusy = false;
            });

        this.fillValues();
    }

    fillValues() {
        if (!_.isEmpty(this.currentActivity.Hour)) {
            this.selectedHour = _.findIndex(
                this.activityService.hourSelections,
                (val) => {
                    return val == this.currentActivity.Hour;
                }
            );
        }

        if (!_.isEmpty(this.currentActivity.ActivityType)) {
            this.selectedActivityType = _.findIndex(
                this.activityService.activityTypes,
                (val) => {
                    return val.key == this.currentActivity.ActivityType;
                }
            );

            if (!_.isEmpty(this.currentActivity.ActivityCustomer)) {
                this.isCustomerSelectActive = true;

                this.selectedCustomer = this.activityService.customerTypeList.getIndex(
                    this.currentActivity.ActivityCustomer
                );
            } else if (!_.isEmpty(this.currentActivity.ActivityProject)) {
                this.isProjectSelectActive = true;

                this.selectedProject = this.activityService.projectList.getIndex(
                    this.currentActivity.ActivityProject
                );

                this.activityService
                    .getRelatedSubProject(this.currentActivity.ActivityProject)
                    .then(
                        (subProjectProvider) => {
                            this.subProjectList = subProjectProvider;
                            this.isSubProjectSelectActive = true;

                            if (
                                !_.isEmpty(
                                    this.currentActivity.ActivityProjectSub
                                )
                            ) {
                                this.selectedSubProject = _.findIndex(
                                    this.activityService.subProjectList[
                                        this.currentActivity.ActivityProject
                                    ],
                                    (val) => {
                                        return (
                                            val.key ==
                                            this.currentActivity
                                                .ActivityProjectSub
                                        );
                                    }
                                );
                            }
                        },
                        () => {
                            this.isSubProjectSelectActive = false;
                        }
                    );
            }
        }

        this.checkIsActivityValid();
    }

    selectedHourChanged(args: SelectedIndexChangedEventData) {
        this.currentActivity.Hour = this.activityService.hourSelections[
            args.newIndex
        ];
        this.checkIsActivityValid();
    }

    activityTypeChanged(args: SelectedIndexChangedEventData) {
        this.httpCallService.isBusy = true;
        this.currentActivity.ActivityType = this.activityService.activityTypeList.getValue(
            args.newIndex
        );
        const activityType: KeyValuePair = _.find(
            this.activityService.activityTypes,
            (item) => {
                return item.key == this.currentActivity.ActivityType;
            }
        );
        this.isSubProjectSelectActive = false;
        if (!_.isNil(activityType)) {
            switch (activityType.req) {
                case "0":
                    this.disableActivitySpecificDropdowns();
                    break;
                case "1":
                    this.isProjectSelectActive = false;
                    this.isCustomerSelectActive = true;
                    break;
                case "2":
                    this.isProjectSelectActive = true;
                    this.isCustomerSelectActive = false;
                    break;
                default:
                    this.disableActivitySpecificDropdowns();
                    break;
            }
        } else {
            this.disableActivitySpecificDropdowns();
        }

        this.resetSelections();
    }

    private disableActivitySpecificDropdowns() {
        this.isProjectSelectActive = false;
        this.isCustomerSelectActive = false;
    }

    activityProjectChanged(args: SelectedIndexChangedEventData) {
        this.httpCallService.isBusy = true;
        this.currentActivity.ActivityProject = this.activityService.projectList.getValue(
            args.newIndex
        );
        this.isSubProjectSelectActive = false;
        this.activityService
            .getRelatedSubProject(this.currentActivity.ActivityProject)
            .then(
                (subProjectProvider) => {
                    this.subProjectList = subProjectProvider;
                    this.isSubProjectSelectActive = true;
                },
                () => {
                    this.isSubProjectSelectActive = false;
                }
            )
            .finally(() => {
                this.httpCallService.isBusy = false;
                this.checkIsActivityValid();
            });
    }

    activityCustomerChanged(args: SelectedIndexChangedEventData) {
        this.currentActivity.ActivityCustomer = this.activityService.customerTypeList.getValue(
            args.newIndex
        );
        this.checkIsActivityValid();
    }

    activitySubProjectChanged(args: SelectedIndexChangedEventData) {
        this.currentActivity.ActivityProjectSub = this.subProjectList.getValue(
            args.newIndex
        );
        this.checkIsActivityValid();
    }

    checkIsActivityValid() {
        this.currentActivity.IsValid =
            !_.isEmpty(this.currentActivity.ActivityDay) &&
            !_.isEmpty(this.currentActivity.Hour) &&
            !_.isEmpty(this.currentActivity.ActivityDescription) &&
            !_.isEmpty(this.currentActivity.ActivityType) &&
            this.checkRequiredFieldsFilled();
    }

    onTextChange(args: EventData) {
        const textView = args.object as TextView;
        this.currentActivity.ActivityDescription = textView.text;
        this.checkIsActivityValid();
    }

    private checkRequiredFieldsFilled() {
        if (this.isCustomerSelectActive) {
            return !_.isEmpty(this.currentActivity.ActivityCustomer);
        } else if (this.isProjectSelectActive) {
            return !_.isEmpty(this.currentActivity.ActivityProject);
        } else {
            return true;
        }
    }

    private resetSelections() {
        this.currentActivity.ActivityCustomer = "";
        this.currentActivity.ActivityProject = "";
        this.currentActivity.ActivityProjectSub = "";

        if (this.isCustomerSelectActive) {
            this.activityService.getCustomers().finally(() => {
                this.httpCallService.isBusy = false;
                this.currentActivity.IsValid = false;
            });
        } else if (this.isProjectSelectActive) {
            this.activityService.getProjects().finally(() => {
                this.httpCallService.isBusy = false;
                this.currentActivity.IsValid = false;
            });
        } else {
            this.httpCallService.isBusy = false;
            this.checkIsActivityValid();
        }
    }
}
