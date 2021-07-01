import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import actions from './tasks-actions';

const {
  getTasksRequest,
  getTasksSuccess,
  getTasksError,
  addTaskRequest,
  addTaskSuccess,
  addTaskError,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskError,
  editTaskRequest,
  editTaskSuccess,
  editTaskError,
  addTaskHoursSuccess,
  addTaskHoursRequest,
  addTaskHoursError,
  changeFilter,
} = actions;

const tasks = createReducer([], {
  [getTasksSuccess]: (_, { payload }) => payload,
  [addTaskSuccess]: (state, { payload }) => [...state, payload],
  [deleteTaskSuccess]: (state, { payload }) =>
    state.filter(({ _id }) => _id !== payload),
  [editTaskSuccess]: (state, { payload }) =>
    state.map(item => {
      if (item._id === payload._id) return payload;
      else return item;
    }),
  [addTaskHoursSuccess]: (state, { payload }) =>
    state.map(item => {
      if (item._id === payload._id) return payload;
      else return item;
    }),
});

const filter = createReducer('', {
  [changeFilter]: (_, { payload }) => payload,
});

const error = createReducer('', {
  [getTasksRequest]: () => '',
  [getTasksSuccess]: () => '',
  [getTasksError]: (_, payload) => payload,
  [addTaskRequest]: () => '',
  [addTaskSuccess]: () => '',
  [addTaskError]: (_, payload) => payload,
  [deleteTaskRequest]: () => '',
  [deleteTaskSuccess]: () => '',
  [deleteTaskError]: (_, payload) => payload,
  [editTaskRequest]: () => '',
  [editTaskSuccess]: () => '',
  [editTaskError]: (_, payload) => payload,
  [addTaskHoursSuccess]: () => '',
  [addTaskHoursRequest]: () => '',
  [addTaskHoursError]: (_, payload) => payload,
});

export default combineReducers({
  tasks,
  filter,
});
