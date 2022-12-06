import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Country } from '../../../interfaces/country';
import { State } from '../../../interfaces/state';
import { UserClient } from '../../../interfaces/user-client';
import { CountriesService } from '../../../services/countries.service';
import { GeneralService } from '../../../services/general.service';
import { SessionService } from '../../../services/session.service';
import { StatesService } from '../../../services/states.service';
import { SweetMessagesService } from '../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../services/toast-message.service';
import {AddCardModalComponent} from '../../../common/modals/add-card-modal/add-card-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {OpenPayCardI} from '../../../interfaces/cards/open-pay-card.interface';
import {GripsOpenPayService} from '../../../services/grips-open-pay.service';

@Component({
  selector: 'app-ajustes-tab',
  templateUrl: './ajustes-tab.page.html',
  styleUrls: ['./ajustes-tab.page.scss'],
})
export class AjustesTabPage implements OnInit {
  public isDisabled = true;

  credentialsForm: UntypedFormGroup;
  changePwdForm: UntypedFormGroup;
  contactDataForm: UntypedFormGroup;
  countries: Country[];
  loadingCountries = false;
  states: State[];
  loadStates = false;
  selectCountry: Country;
  selectedState: State;
  public userData: UserClient;

  changePass = false;
  confirmPassword: string;
  passMatch: boolean;

  data = false;

  cardData: OpenPayCardI[] = [];
  cardDataLoader = false;


  constructor(
    public sessionServ: SessionService,
    public fb: UntypedFormBuilder,
    public sweetServ: SweetMessagesService,
    public countryService: CountriesService,
    public stateService: StatesService,
    public generalServ: GeneralService,
    public toastServ: ToastMessageService,
    private dialog: MatDialog,
    private openPayServ: GripsOpenPayService
  ) {
    this.credentialsForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(80),
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
    });

    this.changePwdForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
    });

    this.contactDataForm = this.fb.group({
      name: ['', Validators.required],
      vat: [''],
      mobile: [''],
      street: [''],
      street2: [''],
      country_id: ['', Validators.required],
      state_id: ['', Validators.required],
      city: [''],
      zip: [''],
    });
  }
  // convenience getter for easy access to form fields
  get credentialsF() {
    return this.credentialsForm.controls;
  }
  get pwdF() {
    return this.changePwdForm.controls;
  }
  get contactF() {
    return this.contactDataForm.controls;
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.data = true;

    this.loadCountries();
    this.loadData();
    this.loadCardsData();
  }

  loadData() {
    this.credentialsForm.disable();
    this.credentialsForm.reset();
    this.changePwdForm.disable();
    this.changePwdForm.reset();
    this.contactDataForm.disable();
    this.contactDataForm.reset();

    this.generalServ.presentLoading();
    this.getUserProfile();
  }

  loadCardsData() {
    this.cardDataLoader = true;
    this.openPayServ.getCardData().subscribe(res => {
      this.cardDataLoader = false;
      if (res.ok) {
        this.cardData = res.cards;
      }
    }, error => {
      this.cardDataLoader = false;
      console.log(error.error.type);
      this.sweetServ.printStatusArray(error.error.errors, 'error');
    });
  }

  getUserProfile() {
    this.sessionServ
      .loadUserData()
      .subscribe((res) => {
        if (res.ok === true) {
          this.userData = res.profile;
          this.generalServ.dismissLoading();
        }
      })
      .add(() => {
        this.fillCredentialsForm(this.userData);
        this.fillChangePwd();
        this.fillContactDataForm(this.userData);

      });
  }

  loadCountries() {
    this.loadingCountries = true;
    this.countryService.loadCountries().subscribe((res) => {
      this.loadingCountries = false;
      if (res.ok === true) {
        this.countries = res.countries;
      }
    }, error => {
      console.log(error);
      this.loadingCountries = false;
    })
  }

  loadStatesList(selected?, country_id?: number) {
    this.loadStates = true;
    this.selectedState = null;
    let id;
    if (selected) {
      id = selected.value.id;
    }
    if (country_id) {
      id = country_id;
    }
    let data = {
      country_id: id,
    };
    this.stateService
      .loadRegions(data)
      .subscribe((res) => {
        if (res.ok === true) {
          this.states = res.states;
        }
      })
      .add(() => {
        if (this.userData && this.userData.state_id) {
          this.selectedState = this.states.find(
            (x) => x.id === this.userData.state_id
          );
        }
        this.loadStates = false;
      });
  }

  fillCredentialsForm(data?) {
    this.credentialsForm.setValue({
      // username: data && data.username ? data.username : null,
      email: data && data.email ? data.email : null,
    });
  }

  fillChangePwd(data?) {
    this.changePwdForm.setValue({
      old_password: data && data.old_password ? data.old_password : '*******',
      new_password: data && data.new_password ? data.new_password : null,
    });
  }

  fillContactDataForm(data?) {
    this.contactDataForm.setValue({
      name: data && data.name ? data.name : null,
      vat: data && data.vat ? data.vat : null,
      mobile: data && data.mobile ? data.mobile : null,
      street: data && data.street ? data.street : null,
      street2: data && data.street2 ? data.street2 : null,
      country_id: data && data.country_id ? data.country_id : null,
      state_id: data && data.state_id ? data.state_id : null,
      city: data && data.city ? data.city : null,
      zip: data && data.zip ? data.zip : null,
    });
    if (data && data.country_id) {
      this.selectCountry = null;
      setTimeout(() => {
        this.selectCountry = this.countries.find((x) => x.id === data.country_id);
      }, 800);
      this.loadStatesList(null, data.country_id);
    }
  }

  changeCredentials() {
    this.sweetServ
      .confirmRequest(
        'Si cambia sus credenciales de acceso, será redirigido a la página de inicio de sesión para autenticarse nuevamente, proceda con cuidado'
      )
      .then((res) => {
        if (res.value) {
          this.credentialsForm.enable();
        } else {
          this.fillCredentialsForm(this.userData);
          this.credentialsForm.disable();
        }
      });
  }
  changePassword() {
    this.sweetServ
      .confirmRequest(
        'Si cambia su contraseña, será redirigido a la página de inicio de sesión para autenticarse nuevamente, proceda con cuidado'
      )
      .then((res) => {
        if (res.value) {
          this.changePass = true;
          this.pwdF.old_password.setValue(null);
          this.changePwdForm.enable();
        } else {
          this.changePass = false;
          this.changePwdForm.disable();
        }
      });
  }
  changeContactData() {
    this.contactDataForm.enable();
  }
  submitContactData() {
    this.data = false;
    let formData = this.contactDataForm.value;
    formData.country_id =
      this.selectCountry && this.selectCountry.id
        ? this.selectCountry.id
        : null;
    formData.state_id =
      this.selectedState && this.selectedState.id
        ? this.selectedState.id
        : null;

    this.generalServ.presentLoading('Guardando datos...');
    this.sessionServ.updateProfile(formData).subscribe(
      (res) => {
        if (res.ok === true) {
          this.sweetServ.printStatus(res.message, 'success');
          this.loadData();
        }
      },
      (error) => {
        this.sweetServ.printStatusArray(error.error.errors, 'error');
        this.cancelSubmitContactData();
        console.log(error);
        this.generalServ.dismissLoading();
      }
    ).add(() => {
      this.generalServ.dismissLoading();
    });
  }
  cancelSubmitContactData() {
    this.contactDataForm.disable();
    this.fillContactDataForm(this.userData);
  }

  savePassword() {

    if (this.pwdF.new_password.value !== this.confirmPassword) {
      this.passMatch = false;
      return false;
    } else {
      this.passMatch = true;
      this.generalServ.presentLoading('Guardando datos...');

      this.sessionServ
        .changePassword(this.changePwdForm.value)
        .subscribe((response) => {
          if (response.ok === true) {
            this.sessionServ.logout();
            this.sweetServ.printStatus(response.message, 'success');
          }
        }, error => {
          this.sweetServ.printStatusArray(error.error.errors, 'error');
          console.log(error);
          this.cancelPassword();
          this.generalServ.dismissLoading();
        }).add(() => {
          this.generalServ.dismissLoading();
        });
    }
  }
  cancelPassword() {
    this.passMatch = null;
    this.confirmPassword = null;
    this.changePass = false;
    this.fillChangePwd();
    this.changePwdForm.disable();
  }

  submitCredentials() {
    this.generalServ.presentLoading('Guardando datos...');
    this.sessionServ
      .updateUsernameOrEmail(this.credentialsForm.value)
      .subscribe(
        (res) => {
          if (res.ok === true) {
            this.sweetServ.printStatus(res.message, 'success');
            this.sessionServ.logout();
          }
        },
        (error) => {
          this.sweetServ.printStatusArray(error.error.errors, 'error');
          this.cancelCredentials();
          this.generalServ.dismissLoading();
        }
      ).add(() => {
        this.generalServ.dismissLoading();
      });
  }
  cancelCredentials() {
    this.credentialsForm.disable();
    this.fillCredentialsForm(this.userData);
  }

  addCard() {
    const dialogRef = this.dialog.open(AddCardModalComponent, {
      panelClass: 'modal-add-card'
    });
    dialogRef.componentInstance.cliente_id = this.userData.id;
    dialogRef.componentInstance.modalEmitter.subscribe(res => {
      if (!res.reload) {
        dialogRef.close();
      } else if (res.reload === true) {
        this.loadCardsData();
        dialogRef.close();
      }
    });
  }

  deleteCard(card: OpenPayCardI) {
    this.sweetServ.confirmRequest('¿Está seguro de querer eliminar su tarjeta ?').then((data) => {
      if (data.value) {
        if (card.token) {
          let payload = {
            cardToken: card.token
          };
          this.cardDataLoader = true;
          this.openPayServ.deleteCardData(payload).subscribe(res =>  {
            if (res.ok) {
              this.toastServ.presentToast('success', res.message, 'middle');
              this.loadCardsData();
            }
          }, error => {
            this.cardDataLoader = false;
            console.log(error);
            this.sweetServ.printStatusArray(error.error.errors, 'error');
          });
        }
      }
    });
  }

  ionViewWillLeave() {
    this.changePass = false;
    this.confirmPassword = null;
    this.passMatch = null;
    this.data = false;
    this.fillCredentialsForm();
  }
}
