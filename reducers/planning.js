import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
};

export const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    initPlanning: (state, action) => {
      state.value = action.payload;
    },
    addPlanning: (state, action) => {
      const { category, data } = action.payload;

      if (category in state.value) {
        state.value[category].push(data);
      }
    },
    updatePlanning: (state, action) => {
      const { category, updatedData } = action.payload;

      state.value[category] = state.value[category].map((item) =>
        item._id === updatedData._id || item.temporaryId === "1"  ? updatedData : item
      );
    },
    deletePlanning: (state, action) => {
      const { category, idToDelete } = action.payload;

      state.value[category] = state.value[category].filter(
        (item) => item._id !== idToDelete
      );
    },
  },
});

export const { initPlanning, addPlanning, updatePlanning, deletePlanning } =
  planningSlice.actions;
export default planningSlice.reducer;
