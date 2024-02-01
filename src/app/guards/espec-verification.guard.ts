import { CanDeactivateFn } from '@angular/router';

export const especVerificationGuard: CanDeactivateFn<unknown> = (component : any, currentRoute, currentState, nextState) => {
  
  if(component.tieneAcceso == false)
  {
    return false;
  }
  else
  {
    return true;
  }
};
