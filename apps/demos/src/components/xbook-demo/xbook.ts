import { Xbook } from "xbook";
import { servicesPlugin } from "./services";

export const xbook = new Xbook();
xbook.use(servicesPlugin);
