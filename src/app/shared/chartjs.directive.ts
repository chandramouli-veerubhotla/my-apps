import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, Colors, registerables } from 'chart.js';

@Directive({
  selector: '[chart]',
  standalone: true
})
export class ChartjsDirective implements OnInit, OnChanges, OnDestroy {

  private chart!: Chart;
  @Input({required: true}) config!: ChartConfiguration;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    Chart.register(...registerables)
    Chart.register(Colors)
    this.initializeChart()
  }

  refresh() {
    if (this.chart) {
      this.chart.destroy()
      this.initializeChart()
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refresh()
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initializeChart() {
    const ctx = this.el?.nativeElement.getContext('2d')
    this.chart = new Chart(ctx, this.config)
  }

}
