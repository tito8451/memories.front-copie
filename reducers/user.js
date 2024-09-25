import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    connectUser: (state, action) => {
      state.value = action.payload;
    },
    initUser: (state, action) => {
      state.value = {};
    },
    deleteUser: (state) => {
      state.value = {};
    },
    updateUser: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
  },
});

export const { connectUser, initUser, deleteUser, updateUser } =
  userSlice.actions;
export default userSlice.reducer;
