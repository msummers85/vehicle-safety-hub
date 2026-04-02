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
  odiNumber: string;
  components: string;
  summary: string;
  dateOfIncident: string;
  dateComplaintFiled: string;
  mileage: number;
  crash: boolean;
  fire: boolean;
  injuries: number;
  deaths: number;
  make: string;
  model: string;
  modelYear: string;
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
