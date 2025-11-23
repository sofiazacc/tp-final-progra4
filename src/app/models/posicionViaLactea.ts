export interface PosicionViaLactea {
  azimut: number;        // Grados (0-360, donde 0=Norte, 90=Este, 180=Sur, 270=Oeste)
  altitud: number;       // Grados (-90 a +90, donde 0=horizonte, 90=cenit, negativo=bajo horizonte)
  visible: boolean;      // Si está sobre el horizonte (altitud > 0)
  direccionCardinal: string;  // Texto descriptivo: "NE", "S", "SO", etc.
  horaCalculo: Date;
  esDeNoche: boolean;    // Indica si es de noche o de día
}