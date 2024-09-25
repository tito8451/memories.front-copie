import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const travelSlice = createSlice({
  name: 'travel',
  initialState,
  reducers: {
    initTravel: (state, action) => {
      state.value = action.payload;
    },
    addTravel: (state, action) => {
      state.value.push(action.payload);
    },
    deleteTravel: (state, action) => {
      state.value = state.value.filter(travel => travel._id !== action.payload);
    },
    updateTravel: (state, action) => {
      const updatedTrip = action.payload;
      
      state.value = state.value.map((trip) =>
        trip._id === updatedTrip._id ? updatedTrip : trip
      );
    },
  },
});

export const { initTravel, addTravel, deleteTravel, updateTravel } = travelSlice.actions;
export default travelSlice.reducer;