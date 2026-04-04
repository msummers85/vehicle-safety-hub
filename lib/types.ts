export interface Recall {
  NHTSACampaignNumber: string;
  Component: string;
  Summary: string;
  Consequence: string;
  Remedy: string;
  ReportReceivedDate: string;
  Manufacturer: string;
  NHTSAActionNumber: string;
  ParkIt: boolean;
  ParkOutSide: boolean;
  Notes: string;
  ModelYear: string;
  Make: string;
  Model: string;
}

export interface Complaint {
  odiNumber: number;
  manufacturer: string;
  components: string;
  summary: string;
  dateOfIncident: string;
  dateComplaintFiled: string;
  crash: boolean;
  fire: boolean;
  numberOfInjuries: number;
  numberOfDeaths: number;
  vin: string;
  products: {
    type: string;
    productYear: string;
    productMake: string;
    productModel: string;
    manufacturer: string;
  }[];
}

export interface SafetyRating {
  OverallRating: string;
  OverallFrontCrashRating: string;
  OverallSideCrashRating: string;
  RolloverRating: string;
  VehicleDescription: string;
  VehicleId: number;
}

export interface VinResult {
  Make: string;
  Model: string;
  ModelYear: string;
  BodyClass: string;
  FuelTypePrimary: string;
  DriveType: string;
  EngineNumberOfCylinders: string;
  DisplacementL: string;
  TransmissionStyle: string;
  PlantCity: string;
  PlantState: string;
  PlantCountry: string;
  VehicleType: string;
  GVWR: string;
}

export interface VehicleData {
  recalls: Recall[];
  complaints: Complaint[];
  safetyRating: SafetyRating | null;
}
