
import * as moment from "moment-timezone";

export class DateConv {
    public static transFormDate(date, format: 'military' | 'regular' | 'matrix' | 'slash' | 'time' | 'localTime' | 'localTimeMoment') {
        if (!moment.invalid(date)) {
          return false;
        }
        let convertDate;
        switch (format) {
          case 'military':
            convertDate = moment(date).format('YYYYMMD');
            break;
          case 'regular':
            convertDate = moment(date).format('YYYY-MM-DD');
            break;
        case 'slash':
            convertDate = moment(date).format('DD/MM/YYYY');
            break;
        case 'time':
          convertDate = moment(date).format('HH:mm');
          break;
        case 'matrix':
          let year = moment(date).format('YYYY');
          let month = moment(date).format('MM');
          let day = moment(date).format('DD');
          convertDate = [year, month, day];
          break;
          case 'localTime':
            convertDate = moment.utc(date).tz(moment.tz.guess()).format('DD/MM/YYYY h:mm:ss a');
            break;
          case 'localTimeMoment':
            convertDate = moment.utc(date).tz(moment.tz.guess());
            console.log('localTimeMoment --->', convertDate);
            break;
        }
        return convertDate;
      }
}
