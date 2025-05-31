export interface Tags {
  userId: string;
  famousPersonId: string;
  siteId: string;
  tagDate: Date;
  geoposicion: {
    latitude: number;
    longitude: number;
  };
}
