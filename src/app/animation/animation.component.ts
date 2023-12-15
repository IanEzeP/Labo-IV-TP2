import { trigger, 
        state, 
        style, 
        animate, 
        transition, 
        query, 
        animateChild, 
        group } from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('HomePage <=> LoginPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%' })
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%' }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%' }))
        ], { optional: true }),
      ]),
    ])
  ]);
/*
  export const slideInUp =
  trigger('routeAnimations', [
    transition('HomePage <=> RegisterPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ bottom: '-100%' })
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ bottom: '100%' }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ bottom: '0%' }))
        ], { optional: true }),
      ]),
    ]),
  ]);*/
  export const slideInUp = trigger('slideInBottom', [
    transition(':enter', [
      style({ transform: 'translateY(100%)' }),
      animate('500ms ease-out', style({ transform: 'translateY(0)' })),
    ]),
    transition(":leave", [
      animate('500ms ease-out', style({ transform: 'translateY(100%)' })),
    ])
  ])