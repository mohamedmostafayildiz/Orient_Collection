import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Renderer2 } from '@angular/core';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-modeloffer',
  templateUrl: './modeloffer.component.html',
  styleUrls: ['./modeloffer.component.scss']
})
export class ModelofferComponent implements OnInit {
  currentDate:any
  code:any;
    loading:boolean=false;
    OfferId:any;
    policyDetails:any;
    constructor(private _ActivatedRoute:ActivatedRoute, private renderer: Renderer2){
      this.OfferId = this._ActivatedRoute.snapshot.paramMap.get('id');
      this.currentDate=new Date()
      console.log(this.currentDate);
      
    }
    handleKeyDown(event: KeyboardEvent): void {
      if (event.ctrlKey && event.key === 'p') {
        event.preventDefault(); // Prevent the default print dialog from opening
        this.print(); // Call your custom print function
        this.generateExcelFile();
      }
    }
     print() {
      this.generateExcelFile();

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        window.print();

      }, 500);
    }

    generateExcelFile() {
      // Example data
      const data = [
        ['Benefit', 'Description'],
        ['Benefit 1', 'Description 1'],
        ['Benefit 2', 'Description 2'],
        ['Benefit 3', 'Description 3']
      ];
    
      // Step 1: Convert the data to a worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(data);
    
      // Step 2: Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Benefits');
    
      // Step 3: Write the workbook to a Blob
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
    
      // Step 4: Trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'جدول_المزايا.xlsx'; // Set the file name
      link.click();
    
      // Step 5: Cleanup
      URL.revokeObjectURL(link.href);
    }
  

  ngOnInit(): void {
    this.renderer.listen('document', 'keydown', this.handleKeyDown.bind(this));
  }
}
