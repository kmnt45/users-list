import { createSlice } from '@reduxjs/toolkit';

import { addUser, deleteUser, fetchUsers, updateUser } from '@/asyncThunks';
import type { User } from '@/models';

type InitialState = {
  users: User[];
  loading: boolean;
  error: string | null;
};

const initialState: InitialState = {
  users: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.loading = false;

        state.users = payload;
      })
      .addCase(fetchUsers.rejected, (state, { payload }) => {
        state.loading = false;

        state.error = payload ?? 'Ошибка при загрузке пользователей';
      })
      .addCase(addUser.pending, (state) => {
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, { payload }) => {
        state.users.push(payload);
      })
      .addCase(addUser.rejected, (state, { payload }) => {
        state.error = payload ?? 'Ошибка при добавлении пользователя';
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.users = state.users.map((user) => (user.id === payload.id ? payload : user));
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.error = payload ?? 'Ошибка при обновлении пользователя';
      })
      .addCase(deleteUser.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.users = state.users.filter((user) => user.id !== payload);
      })
      .addCase(deleteUser.rejected, (state, { payload }) => {
        state.error = payload ?? 'Ошибка при удалении пользователя';
      });
  },
});

export const usersReducer = usersSlice.reducer;
