import { Component, Input, OnInit} from '@angular/core';
import * as moment from "moment";


@Component({
  selector: 'app-timecounter-bar',
  templateUrl: './timecounter-bar.component.html',
  styleUrls: ['./timecounter-bar.component.scss'],
})
export class TimecounterBarComponent implements OnInit {

  @Input() timeTotal: number;
  @Input() warningTime: number;
  @Input() dangerTime: number;
  @Input() index: number;
  @Input() dateToCompare: any;
  @Input() aditionalText: string;

  progressBarWidth: number;

  constructor() { }

  ngOnInit() {
    if (!this.warningTime) {
      this.warningTime = 250;
    }
    if (!this.dangerTime) {
      this.dangerTime = 150;
    }
    if (!this.timeTotal) {
      this.timeTotal = 300;
    }
    if (!this.index) {
      this.index = Math.floor(Math.random() * 100);
    }
    setTimeout(() => {
      this.progress( (this.getLeftSeconds() === 0) ? 0 : this.timeTotal - this.getLeftSeconds(), this.timeTotal);
    }, 500);
  }


  progress(timeleft, timetotal) {

    let element: HTMLElement = document.getElementById('progressBar' + this.index);

    this.progressBarWidth = timeleft * element.offsetWidth / timetotal;
    let _seconds;
    if (timeleft % 60 > 9) {
      _seconds = String(timeleft % 60);
    } else {
      _seconds = '0' + String(timeleft % 60);
    }

    const _left = (Math.floor(timeleft / 60) + ':' + _seconds);
    const _left2 = (Math.floor(timeleft / 60) + _seconds);
    document.getElementById('bar' + this.index).innerHTML = `${_left}`;
    if (_left2 < this.warningTime && _left2 > this.dangerTime) {
      document.getElementById('bar' + this.index).style.backgroundColor = 'rgb(234, 158, 18)';
      document.getElementById('bar' + this.index).style.color = 'white';
      document.getElementById('vigencia' + this.index).style.color = 'rgb(234, 158, 18)';
    } else if (_left2 < this.dangerTime) {
      document.getElementById('bar' + this.index).style.backgroundColor = 'darkred';
      document.getElementById('bar' + this.index).style.color = 'white';
      document.getElementById('vigencia' + this.index).style.color = 'darkred';
    }
    if (timeleft === 0) {
      document.getElementById('bar' + this.index).innerHTML = `0.0`;
      document.getElementById('vigencia' + this.index).innerHTML = `Tiempo agotado`;

    }
    if (timeleft > 0) {

      setTimeout(() => {
        this.progress(timeleft - 1, timetotal);
      }, 1000);
    }
  }

  getLeftSeconds() {
    let duration = moment.duration(moment().diff(this.dateToCompare));
    let seconds = duration.asSeconds();
    if (seconds > this.timeTotal) {
      return 0;
    }
    return Number(Number(seconds).toFixed(0));
  }
}
