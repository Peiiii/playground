import { createPlugin } from "xbook";
import { ActivityService, ActivityServiceToken } from "./activity.service";
import { PageService, PageServiceToken } from "./page.service";

export const servicesPlugin = createPlugin((xbook) => {
  xbook.exposeService(ActivityServiceToken, new ActivityService());
  xbook.exposeService(PageServiceToken, new PageService());
});
