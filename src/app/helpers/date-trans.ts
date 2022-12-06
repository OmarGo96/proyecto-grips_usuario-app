import * as moment from "moment";

export class DateTransform
{
  public static utc(date) {
    return moment(date).utc().format('YYYY-MM-DD hh:mm:ss.SSS A');
  }
}
