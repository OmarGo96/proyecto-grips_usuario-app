import {AfterViewInit, Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonSlides, ModalController, NavController} from '@ionic/angular';
import {MatDialog} from '@angular/material/dialog';
import {AddCardModalComponent} from '../add-card-modal/add-card-modal.component';
import {TransactionsService} from '../../../services/transactions.service';
import {GeneralService} from '../../../services/general.service';
import {OpenPayCardI} from '../../../interfaces/cards/open-pay-card.interface';
import {GripsOpenPayService} from '../../../services/grips-open-pay.service';
import {SweetMessagesService} from '../../../services/sweet-messages.service';

@Component({
  selector: 'app-pay-service-modal',
  templateUrl: './pay-service-modal.component.html',
  styleUrls: ['./pay-service-modal.component.scss'],
})
export class PayServiceModalComponent implements OnInit, AfterViewInit {

  @Input() totalToPay: number;
  @Input() currency: string;
  @Input() clientId: number;
  @Input() model: string;
  @Input() model_id: number;
  @ViewChild('slideWithNav1', {static: false}) slideWithNav1: IonSlides;

  cardsLoader = false;
  cardsClient: OpenPayCardI[];
  selectedCard: OpenPayCardI;

  sliderOne: any;
  slideOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    speed: 400
  };

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private dialog: MatDialog,
    private navCtrl: NavController,
    private transactionServ: TransactionsService,
    private generalServ: GeneralService,
    private openServ: GripsOpenPayService,
    private sweetMsg: SweetMessagesService
  ) { }

  @HostListener('window:resize')
  onResize() {
    setTimeout(() => this.slideWithNav1.update(), 100);
  }

  async ngOnInit() {
    this.loadCards();
  }

  loadCards() {
    this.cardsLoader = true;
    this.openServ.getCardData().subscribe(res => {
      this.cardsLoader = false;
      if (res.ok) {
        this.cardsClient = res.cards;
        let _items = [];
        for (let i of this.cardsClient) {
          _items.push(i);
        }
        this.sliderOne = {
          isBeginningSlide: true,
          isEndSlide: false,
          slidesItems: _items
        };
        if (!this.selectedCard) {
          this.selectIndexCard(0);
        }
      }
    }, error => {
      this.cardsLoader = false;
      console.log(error);
      this.sweetMsg.printStatusArray(error.error.errors, 'error');
    });
  }

  async ngAfterViewInit() {
    if (this.cardsClient) {
      await this.slideWithNav1.update();
    }
  }

  // Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  // Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  // Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView, event) {
    this.slideWithNav1.getActiveIndex().then((data) => {
      this.selectIndexCard(data);
    });

    this.checkIfNavDisabled(object, slideView);
  }

  // Call methods to check if slide is first or last to enable disbale navigation
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }

  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

  restartSlides() {
    this.slideWithNav1.slideTo(0, 500);
  }

  dismiss(data?) {
    this.modalCtrl.dismiss(data);
  }

  selectIndexCard(index) {
   this.selectedCard = this.cardsClient[index];
  }

  async openAddCard() {
    const dialogRef = this.dialog.open(AddCardModalComponent, {
      panelClass: 'modal-add-card'
    });
    dialogRef.componentInstance.cliente_id = this.clientId;
    dialogRef.componentInstance.modalEmitter.subscribe(res => {
      if (!res.reload) {
        dialogRef.close();
      } else if (res.reload === true) {
        this.loadCards();
        dialogRef.close();
      }
    });
  }

  async payNow() {
    let cardPayload = {
      model: this.model,
      model_id: this.model_id,
      amount: this.totalToPay,
      currency: this.currency,
      card_token: this.selectedCard.token
    };
    await this.generalServ.loadNgxSpinner('Procesando transacción ...');
    let _res = await this.transactionServ.payRequest(cardPayload);
    await this.generalServ.hideNgxSpinner();
    await this.dismiss(_res);
  }

}
