export enum Provincia {
  BUENOS_AIRES = 'Buenos Aires',
  CORDOBA = 'Córdoba'
}

export enum Localidad {
  // Buenos Aires
  LA_PLATA = 'La Plata',
  MAR_DEL_PLATA = 'Mar del Plata',
  LA_MATANZA = 'La Matanza',
  LOMAS_DE_ZAMORA = 'Lomas de Zamora',
  
  // Córdoba
  CORDOBA_CAPITAL = 'Córdoba Capital',
  RIO_CUARTO = 'Río Cuarto',
  VILLA_MARIA = 'Villa María',
  VILLA_DOLORES = 'Villa Dolores'
}

//mapeamos
export const PROVINCIAS_LOCALIDADES: Record<Provincia, Localidad[]> = {
  [Provincia.BUENOS_AIRES]: [
    Localidad.LA_PLATA,
    Localidad.MAR_DEL_PLATA,
    Localidad.LA_MATANZA,
    Localidad.LOMAS_DE_ZAMORA
  ],
  [Provincia.CORDOBA]: [
    Localidad.CORDOBA_CAPITAL,
    Localidad.RIO_CUARTO,
    Localidad.VILLA_MARIA,
    Localidad.VILLA_DOLORES
  ]
};