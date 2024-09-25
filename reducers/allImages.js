import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const allImagesSlice = createSlice({
  name: 'allImages',
  initialState,
  reducers: {
    initAllImages: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { initAllImages } =
  allImagesSlice.actions;
export default allImagesSlice.reducer;