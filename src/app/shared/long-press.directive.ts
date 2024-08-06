import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Directive({
  selector: '[appLongPress]',
  standalone: true
})
export class LongPressDirective {

  @Output() longPress = new EventEmitter<void>();
  @Output() shortClick = new EventEmitter<void>();
  
  private longPressSubscription: Subscription | null = null;
  private pressStartTime: number = 0;
  private readonly longPressThreshold: number = 500; // Threshold in milliseconds

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.pressStartTime = new Date().getTime();
    this.longPressSubscription = timer(this.longPressThreshold).subscribe(() => {
      this.longPress.emit();
    });
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  onMouseUp() {
    const pressDuration = new Date().getTime() - this.pressStartTime;
    if (pressDuration < this.longPressThreshold) {
      this.shortClick.emit();
    }
    this.cancelLongPress();
  }

  private cancelLongPress() {
    if (this.longPressSubscription) {
      this.longPressSubscription.unsubscribe();
      this.longPressSubscription = null;
    }
  }
}
