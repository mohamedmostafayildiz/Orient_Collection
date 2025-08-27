import { Injectable } from '@angular/core';
import { arrow } from '@popperjs/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // Define a BehaviorSubject to store data
  private messageSource = new BehaviorSubject<boolean>(false);
  // Observable that other components can subscribe to
  currentMessage = this.messageSource.asObservable();

    private dataSource = new BehaviorSubject<{arrow:boolean, add: string, route: string ,filter:boolean,modal:boolean}>({arrow:false, add: '', route: '' ,filter:false,modal:false});
    currentData = this.dataSource.asObservable();
  

  constructor() {}

  changeMessage(message: boolean) {
    this.messageSource.next(message);
  }

  changeData(arrow:boolean, add: string, route: string,filter:boolean,modal:boolean) {
    this.dataSource.next({arrow,add, route,filter,modal});
  }
  // toogle button of (edit and delete)
  private showButtonsSubject = new BehaviorSubject<boolean>(false);

  // Observable to allow components to subscribe to the changes
  showButtons$ = this.showButtonsSubject.asObservable();

  // Method to toggle the buttons' visibility
  toggleButtons(show: boolean) {
    this.showButtonsSubject.next(show);
  }



  // To appear amodal

    // Create a subject to emit modal open event
    private openModalSubject = new Subject<void>();

    // Observable to be subscribed to
    openModal$ = this.openModalSubject.asObservable();
  
    // Method to trigger the modal open event
    openModal(item: any) {
      this.openModalSubject.next(item);
    }



    // to appear alert in navbar
    private alertMessageSource = new BehaviorSubject<string | null>(null);
    alertMessage$ = this.alertMessageSource.asObservable();
  
    // Method to set the alert message
    setAlertMessage(message: any) {
      this.alertMessageSource.next(message);
    }
  
    // Method to clear the alert message
    clearAlertMessage() {
      this.alertMessageSource.next(null);
    }


    // to pass id
    private itemToDeleteSource = new BehaviorSubject<number | null>(null);
    currentItemToDelete = this.itemToDeleteSource.asObservable();
  
    deleteItem(id: number) {
      this.itemToDeleteSource.next(id);
    }




  private selectedData = new BehaviorSubject<any[]>([]);
  selectedData$ = this.selectedData.asObservable();

  private total = new BehaviorSubject<number>(0);
  total$ = this.total.asObservable();

  setSelectedData(data: any[]) {
    this.selectedData.next(data);
  }

  setTotal(total: number) {
    this.total.next(total);
  }
}
