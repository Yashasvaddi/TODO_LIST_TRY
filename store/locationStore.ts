import { create } from "zustand";

interface LocationState {
  state: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  setState: (state: string) => void;
  setDistrict: (district: string) => void;
  setLatitude: (lat: number) => void;
  setLongitude: (lon: number) => void;
  setLocation: (lat: number, lon: number, state: string, district: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  state: "",
  district: "",
  latitude: null,
  longitude: null,
  setState: (state) => set({ state }),
  setDistrict: (district) => set({ district }),
  setLatitude: (lat) => set({ latitude: lat }),
  setLongitude: (lon) => set({ longitude: lon }),
  setLocation: (lat, lon, state, district) => set({ latitude: lat, longitude: lon, state, district }),
}));
