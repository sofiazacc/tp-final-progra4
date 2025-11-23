export interface SunriseSunsetApiResponse {
  results: {
    sunrise: string;
    sunset: string;
    civil_twilight_begin: string;
    civil_twilight_end: string;
  };
  status: string;
}
