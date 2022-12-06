import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-reload-button',
  templateUrl: './reload-button.component.html',
  styleUrls: ['./reload-button.component.scss'],
})
export class ReloadButtonComponent implements OnInit {

  @Output() reloadPush$ = new EventEmitter();
  @Input() _horizontal: 'center' | 'end' | 'start' = 'start';
  constructor() { }

  ngOnInit() {}

  reloadPush() {
    this.reloadPush$.emit(true);
  }

}
