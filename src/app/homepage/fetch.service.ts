import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  private data = new BehaviorSubject<any>(null);
  currentData = this.data.asObservable();

  updateData(newData:any) {
    this.data.next(newData);
  }
  constructor() { }
}
