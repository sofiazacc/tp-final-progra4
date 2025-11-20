export interface HorasMagicasModel{
    amanecer?: Date | null;
    atardecer?: Date | null;
    inicioHoraAzul?: Date | null;
    finHoraAzul?: Date | null;
    inicioHoraDorara?: Date | null;
    finHoraDorada?: Date | null;
    
}

// No es necesario que los atributos coincidan con los campos del json. El mapeo
// se lleva a cabo en el service.