export interface Sitios {
  nombre: string;
  ciudadId: string;
  tipo: string;
  geoposicion: {
    latitude: number;
    longitude: number;
  };
  imageUrl: string;
}
