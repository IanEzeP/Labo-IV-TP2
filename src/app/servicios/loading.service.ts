import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  public isLoading = false; 

  constructor() { }

  load()
  {
    this.isLoading = true;
  }

  stop()
  {
    this.isLoading = false;
  }
}
