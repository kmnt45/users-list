import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AxiosError } from 'axios';

import type { User, NewUser } from '@/models';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('Api url is not defined');
}

const usersUrl = (id?: string) => (id ? `${API_URL}/users/${id}` : `${API_URL}/users`);

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get<User[]>(usersUrl());

      return res.data;
    } catch (err) {
      const error = err as AxiosError;

      return rejectWithValue(error.message || 'Ошибка при загрузке пользователей');
    }
  },
);

export const addUser = createAsyncThunk<User, NewUser, { rejectValue: string }>(
  'users/addUser',
  async (user, { rejectWithValue }) => {
    try {
      const res = await axios.post<User>(usersUrl(), user);

      return res.data;
    } catch (err) {
      const error = err as AxiosError;

      return rejectWithValue(error.message || 'Ошибка при добавлении пользователя');
    }
  },
);

export const updateUser = createAsyncThunk<User, Partial<User>, { rejectValue: string }>(
  'users/updateUser',
  async (user, { rejectWithValue }) => {
    try {
      const res = await axios.put<User>(usersUrl(user.id), user);

      return res.data;
    } catch (err) {
      const error = err as AxiosError;

      return rejectWithValue(error.message || 'Ошибка при обновлении пользователя');
    }
  },
);

export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(usersUrl(id));

      return id;
    } catch (err) {
      const error = err as AxiosError;

      return rejectWithValue(error.message || 'Ошибка при удалении пользователя');
    }
  },
);
