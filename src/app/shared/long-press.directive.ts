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
  private startX: number = 0;
  private startY: number = 0;
  private moved: boolean = false;
  private readonly longPressThreshold: number = 500; // Threshold in milliseconds
  private readonly moveThreshold: number = 10; // Threshold in pixels for detecting movement

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onPressStart(event: MouseEvent | TouchEvent) {
    this.pressStartTime = new Date().getTime();

    if (event instanceof MouseEvent) {
      this.startX = event.clientX;
      this.startY = event.clientY;
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    }

    this.moved = false;
    this.longPressSubscription = timer(this.longPressThreshold).subscribe(() => {
      if (!this.moved) {
        this.longPress.emit();
      }
    });
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('mousemove', ['$event'])
  onPressMove(event: MouseEvent | TouchEvent) {
    let deltaX = 0;
    let deltaY = 0;

    if (event instanceof MouseEvent) {
      deltaX = Math.abs(event.clientX - this.startX);
      deltaY = Math.abs(event.clientY - this.startY);
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      deltaX = Math.abs(event.touches[0].clientX - this.startX);
      deltaY = Math.abs(event.touches[0].clientY - this.startY);
    }

    if (deltaX > this.moveThreshold || deltaY > this.moveThreshold) {
      this.moved = true;
      this.cancelLongPress();
    }
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  onPressEnd() {
    const pressDuration = new Date().getTime() - this.pressStartTime;
    if (pressDuration < this.longPressThreshold && !this.moved) {
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
