/**
 * @fileoverview Central configuration for geographic districts.
 * This file defines the static properties of each sales district, including:
 * - Real-world area in square kilometers.
 * - Geographic boundaries defined as a polygon of [longitude, latitude] coordinates.
 * - A collection of named sub-zones within the district.
 * 
 * This data is considered the "source of truth" for calculating prospect density,
 * assigning prospects to districts, and rendering geographic visualizations.
 */

// Interface for a sub-zone (a cell in the 4x3 grid)
export interface SubZone {
  name: string; // e.g., "Blue Island Ave"
}

// Interface for a main district
export interface District {
  code: string;
  name: string; // e.g., "Pilsen / Lower West Side"
  areaKm2: number;
  boundaries: [number, number][]; // Polygon for the entire district [lng, lat]
  subZones: Record<string, SubZone>; // e.g., { "CHI-PIL-01": { name: "Blue Island Ave" } }
}

export const districts: Record<string, District> = {
  "CHI-PIL": {
    code: "CHI-PIL",
    name: "Pilsen / Lower West Side",
    areaKm2: 2.1,
    boundaries: [
      [-87.6750, 41.8620], // NW - Western Ave
      [-87.6550, 41.8620], // NE - Dan Ryan Expressway
      [-87.6550, 41.8500], // SE - Cermak Rd
      [-87.6750, 41.8500], // SW - 26th St area
      [-87.6750, 41.8620]  // Close polygon
    ],
    subZones: {
      "CHI-PIL-01": { name: "Blue Island Ave" },
      "CHI-PIL-02": { name: "Cermak Rd East" },
      "CHI-PIL-03": { name: "18th & Ashland" },
      "CHI-PIL-04": { name: "Damen Ave Corridor" },
      "CHI-PIL-05": { name: "Heart of Pilsen" },
      "CHI-PIL-06": { name: "18th St Commercial" },
      "CHI-PIL-07": { name: "Western Ave Edge" },
      "CHI-PIL-08": { name: "Cullerton St Arts" },
      "CHI-PIL-09": { name: "Benito Juarez Park" },
      "CHI-PIL-10": { name: "Canalport Riverfront" },
      "CHI-PIL-11": { name: "Industrial South" },
      "CHI-PIL-12": { name: "East Residential" },
    }
  },
  "CHI-LV": {
    code: "CHI-LV",
    name: "Little Village / La Villita",
    areaKm2: 3.4,
    boundaries: [
      [-87.7150, 41.8500], // NW - Kedzie Ave north
      [-87.6950, 41.8500], // NE - Western Ave
      [-87.6950, 41.8380], // SE - 31st St
      [-87.7150, 41.8380], // SW - Cicero Ave
      [-87.7150, 41.8500]  // Close polygon
    ],
    subZones: {
      "CHI-LV-01": { name: "26th St (East)" },
      "CHI-LV-02": { name: "26th St (Central)" },
      "CHI-LV-03": { name: "26th St (West)" },
      "CHI-LV-04": { name: "Kedzie Ave Corridor" },
      "CHI-LV-05": { name: "Marshall Square" },
      "CHI-LV-06": { name: "California Ave" },
      "CHI-LV-07": { name: "North Residential" },
      "CHI-LV-08": { name: "South Residential" },
      "CHI-LV-09": { name: "Washtenaw Ave" },
      "CHI-LV-10": { name: "Industrial Park" },
      "CHI-LV-11": { name: "Rockwell St" },
      "CHI-LV-12": { name: "Piotrowski Park" },
    }
  },
  "CHI-AP": {
    code: "CHI-AP",
    name: "Albany Park",
    areaKm2: 2.8,
    boundaries: [
      [-87.7250, 41.9750], // NW - Pulaski Rd
      [-87.7050, 41.9750], // NE - Ridge Blvd
      [-87.7050, 41.9650], // SE - Montrose Ave
      [-87.7250, 41.9650], // SW - Irving Park Rd
      [-87.7250, 41.9750]  // Close polygon
    ],
    subZones: {
      "CHI-AP-01": { name: "Lawrence & Kedzie" },
      "CHI-AP-02": { name: "Lawrence & Kimball" },
      "CHI-AP-03": { name: "Montrose Ave East" },
      "CHI-AP-04": { name: "Pulaski Rd North" },
      "CHI-AP-05": { name: "Kimball Brown Line" },
      "CHI-AP-06": { name: "North Park University" },
      "CHI-AP-07": { name: "River Park" },
      "CHI-AP-08": { name: "Kedzie Residential" },
      "CHI-AP-09": { name: "Wilson Ave" },
      "CHI-AP-10": { name: "Central Park Ave" },
      "CHI-AP-11": { name: "Elston Ave" },
      "CHI-AP-12": { name: "Foster Ave West" },
    }
  },
  "IN-LAF": {
    code: "IN-LAF",
    name: "Lafayette, Indiana",
    areaKm2: 4.5,
    boundaries: [
      [-86.9200, 40.4300], // NW
      [-86.8600, 40.4300], // NE
      [-86.8600, 40.3800], // SE
      [-86.9200, 40.3800], // SW
      [-86.9200, 40.4300]  // Close
    ],
    subZones: {
      "IN-LAF-01": { name: "Downtown Lafayette" },
      "IN-LAF-02": { name: "Purdue University" },
      "IN-LAF-03": { name: "Sagamore Pkwy" },
      "IN-LAF-04": { name: "SR 26 Corridor" },
      "IN-LAF-05": { name: "Creasy Ln" },
      "IN-LAF-06": { name: "South St" },
      "IN-LAF-07": { name: "N 9th St" },
      "IN-LAF-08": { name: "Veterans Memorial" },
      "IN-LAF-09": { name: "North Industrial" },
      "IN-LAF-10": { name: "East Residential" },
      "IN-LAF-11": { name: "South Residential" },
      "IN-LAF-12": { name: "West Residential" },
    }
  },
  "WI-MKE": {
    code: "WI-MKE",
    name: "Milwaukee, Wisconsin",
    areaKm2: 5.1,
    boundaries: [
      [-87.9500, 43.0600], // NW
      [-87.8800, 43.0600], // NE
      [-87.8800, 43.0100], // SE
      [-87.9500, 43.0100], // SW
      [-87.9500, 43.0600]  // Close
    ],
    subZones: {
      "WI-MKE-01": { name: "Walker's Point" },
      "WI-MKE-02": { name: "Historic Third Ward" },
      "WI-MKE-03": { name: "Mitchell Street" },
      "WI-MKE-04": { name: "Clarke Square" },
      "WI-MKE-05": { name: "Lincoln Village" },
      "WI-MKE-06": { name: "Bay View South" },
      "WI-MKE-07": { name: "Downtown East" },
      "WI-MKE-08": { name: "Menomonee Valley" },
      "WI-MKE-09": { name: "Brady Street" },
      "WI-MKE-10": { name: "Riverwest" },
      "WI-MKE-11": { name: "East Side" },
      "WI-MKE-12": { name: "West Allis Border" },
    }
  },
};
