import { Injectable } from "@angular/core";
import { ToastDuration, ToastPosition, Toasty } from "nativescript-toasty";
import { Color } from "@nativescript/core";
import { ToastyType } from "../models/toasty.model";
@Injectable()
export class ToastyService {
    constructor() {}

    openToasty(message: string, toastyType: ToastyType) {
        let backgroundColor: string;
        switch (toastyType) {
            case "success":
                backgroundColor = "#10be00";
                break;
            case "info":
                backgroundColor = "#0088ff";
                break;
            case "warning":
                backgroundColor = "#ff9d00";
                break;
            case "error":
                backgroundColor = "#ff0800";
                break;
            default:
                break;
        }
        const toasty = new Toasty({
            text: message,
            position: ToastPosition.TOP,
            yAxisOffset: 100,
            xAxisOffset: 10,
        });

        toasty.duration = ToastDuration.SHORT;
        toasty.textColor = "#000000";
        toasty.backgroundColor = new Color(backgroundColor);
        toasty.show();
    }
}
