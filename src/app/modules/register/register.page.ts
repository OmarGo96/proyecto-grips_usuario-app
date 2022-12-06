import { SweetMessagesService } from './../../services/sweet-messages.service';
import { SessionService } from 'src/app/services/session.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import {GeneralService} from '../../services/general.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: UntypedFormGroup;
  public confirmPassword: string;
  public confirmPwdError: boolean;
  public spinner = false;
  constructor(
    public navigate: NavController,
    private formBuilder: UntypedFormBuilder,
    public SessionService: SessionService,
    private sweetMsg: SweetMessagesService,
    private generalServ: GeneralService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      vat: ['']
    });
   }

    // convenience getter for easy access to form fields
  get cf() {
    return this.registerForm.controls;
  }


  ngOnInit() {
  }

  submit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    if (this.registerForm.controls.password.value !== this.confirmPassword) {
      this.confirmPwdError = true;
      return;
    } else {
      this.confirmPwdError = false;
    }

    this.spinner = true;

    this.SessionService.registerUser(this.registerForm.value).subscribe(res => {
      if (res.ok === true) {
        this.sweetMsg.printStatus('Necesitamos verificar tu cuenta, para ello te hemos enviado un correo con instrucciones', 'warning');
        this.generalServ.verifyEmail$.next(this.registerForm.controls.email.value);
        setTimeout(() => {
          this.goToVerifyUser();
        }, 2000);
      }
    }, error => {
      this.sweetMsg.printStatusArray(error.error.errors, 'error');
      console.log(error);
    }).add(() => {
      this.spinner = false;
    });

  }

  goToVerifyUser() {
    this.navigate.navigateRoot(['otp/verify-register']);
  }

  back() {
    this.navigate.navigateRoot(['landing']);
  }

}
