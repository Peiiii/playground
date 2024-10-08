import { typedKey } from "@playground/app-toolkit";
import { createReactBean } from "rx-bean";
import { useStateFromObservable } from "rx-nested-bean";
import { map } from "rxjs";

export interface IActivity {
  id: string;
  name: string;
  status: "active" | "inactive";
}

export const ActivityServiceToken =
  typedKey<ActivityService>("ActivityService");

export class ActivityService {
  private activityController = createReactBean(
    "ActivityList",
    [] as IActivity[]
  );

  getActivityList = this.activityController.getActivityList;

  setActivityList = this.activityController.setActivityList;

  useActivityList = this.activityController.useActivityList;

  activityList$ = this.activityController.ActivityList$;

  addActivity = (activity: IActivity) => {
    this.activityController.setActivityList([
      ...this.activityController.getActivityList(),
      activity,
    ]);
  };

  updateActivity = (activity: IActivity) => {
    this.activityController.setActivityList(
      this.activityController
        .getActivityList()
        .map((act) => (act.id === activity.id ? activity : act))
    );
  };

  deleteActivity = (id: string) => {
    this.activityController.setActivityList(
      this.activityController.getActivityList().filter((act) => act.id !== id)
    );
  };

  getActivity$ = (id: string) => {
    return this.activityController.ActivityList$.pipe(
      map((acts) => acts.find((act) => act.id === id))
    );
  };

  getActivity = (id: string) => {
    return this.getActivityList().find((act) => act.id === id);
  };

  useActivity = (id: string) => {
    return useStateFromObservable(this.getActivity$(id), this.getActivity(id));
  };
}
