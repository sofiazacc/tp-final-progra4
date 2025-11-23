import { Component } from '@angular/core';
import { Calculadora500 } from '../../services/calculadoras/calculadora500';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-caculadora500-component',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './caculadora500-component.html',
  styleUrl: './caculadora500-component.css'
})
export class Caculadora500Component {

  formulario: FormGroup
  focal: FormControl
  recorte: FormControl

  resultado: number | undefined


  constructor(public calculadora500: Calculadora500) { 

    this.focal = new FormControl('')
    this.recorte = new FormControl('')
    this.formulario = new FormGroup({
      focal: this.focal,
      recorte: this.recorte
    })

  }
  
  mostrarResultado(){
    const focalNum = Number(this.focal.value)
    const recorteNum = Number(this.recorte.value)

    this.resultado = this.calculadora500.calcularTiempoDeExposicion(focalNum, recorteNum)
  }
  }
