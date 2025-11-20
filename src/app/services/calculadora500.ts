import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Calculadora500 {

  calcularTiempoDeExposicion(focal: number, factorRecorte: number): number{
    if(focal <= 0 || factorRecorte <= 0){
      return 0
    }

    return 500 / (focal * factorRecorte);
  }

}
