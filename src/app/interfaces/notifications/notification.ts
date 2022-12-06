import { NotificationParams } from "./noti-params";

export interface NotificationI
{
  title: string;
  body: string;
  img?: string;
  data?: NotificationParams;
}
