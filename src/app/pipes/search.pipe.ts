import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  // transform(items:any[] , term:any): any {
  //   if(term == undefined){
  //     return items;
  //   }

  //   return items.filter(function(items){
  //     if(items.firstName!=null){
  //       return items.firstName.toLowerCase().includes(term.toLowerCase()) || items.lastName.toLowerCase().includes(term.toLowerCase())
  //     }else if(items.name!=null){
  //       return items.name.toLowerCase().includes(term.toLowerCase())
  //     }
      
  //     else if(items.planName!=null){
  //       return items.planName.toLowerCase().includes(term.toLowerCase()) || items.typeOfService.toLowerCase().includes(term.toLowerCase())
  //     }else if(items.benefitType!=null){
  //       return items.benefitType.toLowerCase().includes(term.toLowerCase()) || items.name.toLowerCase().includes(term.toLowerCase()) 
  //     }

      
  //     else if(items.code!=null){
  //       return items.code.includes(term) ||items.insuredName.toLowerCase().includes(term.toLowerCase())||items.tpaName.toLowerCase().includes(term.toLowerCase())
  //     }
   

  // })
          // if(items.firstName!=null){
      //   return items.firstName.toLowerCase().includes(term.toLowerCase())
      // }
      // else if(items.educationName!=null){
      //   return items.educationName.toLowerCase().includes(term.toLowerCase())
      // }

  // }
  transform(items: any[], term: any): any {
    if (!term) return items;

    term = term.toLowerCase();

    return items.filter(item => {
      return (
        item.firstName?.toLowerCase().includes(term) ||
        item.lastName?.toLowerCase().includes(term) ||
        item.name?.toLowerCase().includes(term) ||
        item.insuranceClass?.toLowerCase().includes(term) ||
        item.commissionType?.toLowerCase().includes(term) ||
        item.businessType?.toLowerCase().includes(term) ||
        item.customerName?.toLowerCase().includes(term) ||
        item.code?.toLowerCase().includes(term) ||
        item.planName?.toLowerCase().includes(term) ||
        item.typeOfService?.toLowerCase().includes(term) ||
        item.benefitType?.toLowerCase().includes(term) ||
        item.code?.includes(term) ||
        item.insuredName?.toLowerCase().includes(term) ||
        item.tpaName?.toLowerCase().includes(term)||
        item.arabicName?.toLowerCase().includes(term)||
        item.englishName?.toLowerCase().includes(term)||
        item.bankName?.toLowerCase().includes(term)
      );
    });
}

}
