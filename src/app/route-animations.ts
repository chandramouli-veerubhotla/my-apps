import { trigger, transition, style, animate, query, group } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
    
    transition('investmentDashboardPage => newTrackerPage', [
        query(':enter, :leave', [
          style({ position: 'absolute', width: '100%' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('0.1s ease-out', style({ opacity: 0 }))  // Moves the component up when leaving
          ], { optional: true }),
          query(':enter', [
            style({ transform: 'translateY(100%)' }),  // Moves the component from down to its original position
            animate('0.3s ease-in', style({ transform: 'translateY(0%)' }))
          ], { optional: true })
        ])
      ]),
      transition('newTrackerPage => investmentDashboardPage', [
        query(':enter, :leave', [
          style({ position: 'absolute', width: '100%' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('0.2s ease-out', style({ transform: 'translateY(100%)', opacity: 0.4 }))  // Moves the component down when leaving
          ], { optional: true }),
         
        ])
      ]),


      transition('investmentDashboardPage => investmentTrackerPage', [
        query(':enter, :leave', [
          style({ position: 'absolute', width: '100%' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('0.3s ease-in', style({transform: 'translateX(-100%)', opacity: 0.6 }))  // Fade out when leaving
          ], { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(100%)' }),  // Enter from the right
            animate('0.3s ease-in', style({ transform: 'translateX(0%)' }))  // Slide in to the left
          ], { optional: true })
        ])
      ]),
      transition('investmentTrackerPage => investmentDashboardPage', [
        query(':enter, :leave', [
          style({ position: 'absolute', width: '100%' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('0.3s ease-in', style({ transform: 'translateX(100%)', opacity: 0.6 }))  // Slide out to the left with fade out
          ], { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),  // Enter from the left
            animate('0.3s ease-in', style({ transform: 'translateX(0%)' }))  // Slide in to the right
          ], { optional: true })
        ])
      ]),
      
      

     
  transition('fadeIn <=> *', [
    query(':enter, :leave', [
      style({ position: 'absolute', width: '100%' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('0.3s ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);
