import { SessionService } from 'src/app/services/session.service';
import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit, AfterViewInit {

  @ViewChild('slideWithNav1', {static: false}) slideWithNav1: IonSlides;

  sliderOne: any;
  slideOptions = {
    initialSlide: 0,
    slidesPerView: 2,
    autoplay: true,
    speed: 400
  };

  constructor(
    public navigate: NavController,
    private sessionService: SessionService
  ) { }

  @HostListener('window:resize')
  onResize() {
    setTimeout(() => this.slideWithNav1.update(), 100);
  }

  ngOnInit() {
    if (this.sessionService.getToken()) {
      this.navigate.navigateRoot(['partners']);
      return;
    }
    this.sliderOne = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [1,1,1,1,1,1]
    }
  }

  ngAfterViewInit(): void {


  }

  // Move to Next slide
  slideNext(object, slideView) {
    // this.imageLoaded = false;
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  // Move to previous slide
  slidePrev(object, slideView) {
    // this.imageLoaded = false;
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  // Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView, event) {
    this.slideWithNav1.getActiveIndex().then((data) => {
      // console.log(data);
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

}
