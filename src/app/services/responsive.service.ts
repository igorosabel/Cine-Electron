import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Injectable()
export default class ResponsiveService implements OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  public screenWidth$: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(null);
  public mediaBreakpoint$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  public static XS: number = 576;
  public static SM: number = 768;
  public static MD: number = 992;
  public static LG: number = 1200;
  public static XL: number = 1600;

  constructor() {
    this.init();
  }

  init(): void {
    this._setScreenWidth(window.innerWidth);
    this._setMediaBreakpoint(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this._unsubscriber$))
      .subscribe((evt: Event): void => {
        if (evt.target !== null) {
          this._setScreenWidth((<Window>evt.target).innerWidth);
          this._setMediaBreakpoint((<Window>evt.target).innerWidth);
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscriber$.next(null);
    this._unsubscriber$.complete();
  }

  private _setScreenWidth(width: number): void {
    this.screenWidth$.next(width);
  }

  private _setMediaBreakpoint(width: number): void {
    if (width < ResponsiveService.XS) {
      this.mediaBreakpoint$.next('xs');
    } else if (width >= ResponsiveService.XS && width < ResponsiveService.SM) {
      this.mediaBreakpoint$.next('sm');
    } else if (width >= ResponsiveService.SM && width < ResponsiveService.MD) {
      this.mediaBreakpoint$.next('md');
    } else if (width >= ResponsiveService.MD && width < ResponsiveService.LG) {
      this.mediaBreakpoint$.next('lg');
    } else if (width >= ResponsiveService.LG && width < ResponsiveService.XL) {
      this.mediaBreakpoint$.next('xl');
    } else {
      this.mediaBreakpoint$.next('xxl');
    }
  }
}
