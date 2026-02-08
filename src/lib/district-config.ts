
export interface District {
  name: string;
  // The real area in square kilometers. This is a fixed value.
  areaKm2: number; 
  // An array of [longitude, latitude] pairs that form the polygon of the district.
  // This is where you will add the GeoJSON coordinates.
  boundaries: [number, number][]; 
}

export const districtData: Record<string, District> = {
  "CHI-PIL": {
    name: "Pilsen / Lower West Side",
    areaKm2: 2.1,
    // TODO: Add the actual polygon coordinates here.
    // Example format: boundaries: [[-87.6750, 41.8620], [-87.6550, 41.8620], ...]
    boundaries: [], 
  },
  "CHI-LV": {
    name: "Little Village / La Villita",
    areaKm2: 3.4,
    boundaries: [],
  },
  "CHI-AP": {
    name: "Albany Park",
    areaKm2: 2.8,
    boundaries: [],
  },
  "IN-LAF": {
    name: "Lafayette, Indiana",
    areaKm2: 4.5,
    boundaries: [],
  },
  // Add other districts here following the same structure.
};
