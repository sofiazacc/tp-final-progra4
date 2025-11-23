export interface HorasMagicasModel {
  amanecer: Date;
  atardecer: Date;
  horaAzulAM_Inicio: Date;
  horaAzulAM_Fin: Date;
  horaAzulPM_Inicio: Date;
  horaAzulPM_Fin: Date;
  horaDoradaAM_Inicio: Date;
  horaDoradaAM_Fin: Date;
  horaDoradaPM_Inicio: Date;
  horaDoradaPM_Fin: Date;
}


// No es necesario que los atributos coincidan con los campos del json. El mapeo
// se lleva a cabo en el service.