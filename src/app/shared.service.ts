import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private fullscreenSubject = new BehaviorSubject<boolean>(false);
  toggleSideBar = new BehaviorSubject<boolean>(false);
  fullscreenState$ = this.fullscreenSubject.asObservable();

  Fullscreen(isFullscreen: boolean):any {
    this.fullscreenSubject.next(isFullscreen);
  }
  exitFullscreen(): void {
    if (document.fullscreenElement) {
        document.exitFullscreen().then(() => this.Fullscreen(false));
    }
  }

  setToggle(v: boolean) {
    this.toggleSideBar.next(v);
  }

  constructor() { }
}
