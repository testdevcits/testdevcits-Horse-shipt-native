import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HorseState {
  horses: any[];
  selectedHorse: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: HorseState = {
  horses: [],
  selectedHorse: null,
  loading: false,
  error: null,
};

const horseSlice = createSlice({
  name: 'horse',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setHorses: (state, action: PayloadAction<any[]>) => {
      state.horses = action.payload;
      state.loading = false;
      state.error = null;
    },

    setSelectedHorse: (state, action: PayloadAction<any | null>) => {
      state.selectedHorse = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearHorseState: (state) => {
      state.horses = [];
      state.selectedHorse = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setHorses,
  setSelectedHorse,
  setError,
  clearHorseState,
} = horseSlice.actions;

export default horseSlice.reducer;