import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import SignaturePad from 'signature_pad';
import { Signature } from 'src/app/interfaces/signature';
import {SweetMessagesService} from '../../../services/sweet-messages.service';


@Component({
  selector: 'app-signature-capture',
  templateUrl: './signature-capture.component.html',
  styleUrls: ['./signature-capture.component.scss']
})
export class SignatureCaptureComponent implements OnInit, AfterViewInit, AfterViewChecked {

  //#region ATTRIBUTES
  @ViewChild('canvas1', { static: false }) signaturePadElement1;
  public captureSignatureLabel: string;
  signaturePad1: any;
  public isSmallDivice: boolean;
  @Output() signatureEmit = new EventEmitter();
  @Output() signatureRefresh = new EventEmitter();
  public signatureCaptured: Signature;
  @Input() instanceType: 'accordion' | 'plain' = 'accordion';
  //#endregion

  constructor(
    private messageService: SweetMessagesService,
    private cdRef: ChangeDetectorRef,
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.window.innerWidth <= 1024) {
      this.isSmallDivice = true;
    } else {
      this.isSmallDivice = false;
    }
    if (event.target.window.innerWidth <= 768) {
      setTimeout(() => {
        this.initSignature();
      }, 1000);
    } else {
      setTimeout(() => {
        this.initSignature();
      }, 1000);
    }
  }

  ngOnInit(): void {
    //console.log(this.instanceType);
    //this.initSignature(true);
  }

  ngAfterViewInit(): void {
    this.initSignature(true);
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }


  //#region SIGNATURE FUNCTIONS

  // Función para inicializar firma
  initSignature(firstTime?: boolean) {
    if (!this.signaturePad1) {
      //let timeOut = (firstTime && firstTime === true) ? 1000 : 0;
      let timeOut = 0;
      setTimeout(() => {
        this.signaturePad1 = new SignaturePad(this.signaturePadElement1.nativeElement);
        this.signaturePad1.clear();
        this.signaturePad1.penColor = 'rgb(0,0,0)';

        const canvas: any = document.getElementById('canva-signature1') as HTMLCanvasElement;

        let _with = document.getElementById('signature-container1').offsetWidth;
        if (_with === 0) {
          canvas.width = 300;
        } else {
          canvas.width = _with;
        }
        this.signaturePad1.clear();

        this.signaturePad1.onEnd = () => {
          this.emitSignature();
        };
      }, timeOut);
    }
  }

  isCanvasBlank(): boolean {
    if (!this.signaturePad1) {
      return false;
    } else {
      return this.signaturePad1.isEmpty();
    }
  }

  collapseSign() {
    this.captureSignatureLabel = 'Press here to sign certificate';
  }

  expandSign() {
    this.captureSignatureLabel = 'Capture signature';
  }

  clear() {
    if (!this.signaturePad1) {
      this.initSignature();
    }
    this.signaturePad1.clear();
    this.signatureRefresh.emit();
  }

  undo() {
    const data = this.signaturePad1.toData();
    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad1.fromData(data);
      console.log(data.length);
      if (data.length === 0) {
        console.log('no data');
        this.signatureRefresh.emit();
      }
    }
  }

  cropSignatureCanvas(canva?: HTMLCanvasElement) {

    const canvas: HTMLCanvasElement = canva;
    const croppedCanvas: HTMLCanvasElement = document.createElement('canvas');
    const croppedCtx: CanvasRenderingContext2D = croppedCanvas.getContext('2d');

    croppedCanvas.width = canvas.width;
    croppedCanvas.height = canvas.height;
    croppedCtx.drawImage(canvas, 0, 0);

    let w = croppedCanvas.width;
    let h = croppedCanvas.height;
    const pix = { x: [], y: [] };
    const imageData = croppedCtx.getImageData(0, 0, w, h);
    let index = 0;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        index = (y * w + x) * 4;
        if (imageData.data[index + 3] > 0) {
          pix.x.push(x);
          pix.y.push(y);
        }
      }
    }

    pix.x.sort((a, b) => a - b);
    pix.y.sort((a, b) => a - b);
    const n = pix.x.length - 1;

    w = pix.x[n] - pix.x[0];
    h = pix.y[n] - pix.y[0];
    const cut = croppedCtx.getImageData(pix.x[0], pix.y[0], w, h);

    croppedCanvas.width = w;
    croppedCanvas.height = h;
    croppedCtx.putImageData(cut, 0, 0);

    return croppedCanvas.toDataURL();
  }


  saveSign(): void {
    if (this.signaturePad1.isEmpty() === true) {
      this.messageService.printStatus('Please sign first in order to proceed', 'warning');
      return;
    }
    this.messageService.confirmRequest('Are you sure to capture this signature, This action will upload the current certificate signed ?').then(data => {
      if (data.value) {
        let img;
        let metaData;
        // img = this.cropSignatureCanvas(this.signaturePadElement1.nativeElement);
        img = this.signaturePad1.toDataURL();
        metaData = this.signaturePad1.toData();

        // emitimos datos al componente padre
        this.signatureCaptured = {
          signature_matrix: metaData,
          signature_img: img
        }

        this.signatureEmit.emit(this.signatureCaptured);

      } else {
        this.messageService.dismissAction();
      }
    });
  }

  emitSignature() {
    let img;
    let metaData;
    img = this.signaturePad1.toDataURL();
    metaData = this.signaturePad1.toData();

    // emitimos datos al componente padre
    this.signatureCaptured = {
      signature_matrix: metaData,
      signature_img: img
    }

    this.signatureEmit.emit(this.signatureCaptured);
  }
  //#endregion

}
