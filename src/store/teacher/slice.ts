import { CaseReducer, createSlice } from '@reduxjs/toolkit';
import { getAllTeachers, pending as getPending, rejected as getRejected, fulfilled as getFulfilled } from './getAllTeachers';
import { createTeacher, pending as createPending, rejected as createRejected, fulfilled as createFulfilled } from './createTeacher';
import { updateTeacher, pending as updatePending, rejected as updateRejected, fulfilled as updateFulfilled } from './updateTeacher';
import { deleteTeacher, pending as deletePending, rejected as deleteRejected, fulfilled as deleteFulfilled } from './deleteTeacher';
import { teacherDatatype } from '../../utils/types';

const initialState: stateType = {
	fetching: 'standby',
	creating: 'standby',
	updating: 'standby',
	deleting: 'standby',

	fetchMessage: '',
	createMessage: '',
	deleteMessage: '',
	updateMessage: '',
	data: [],
};

export interface stateType {
	fetching: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	creating: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	updating: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	deleting: 'standby' | 'pending' | 'rejected' | 'fulfilled';

	fetchMessage: string;
	createMessage: string;
	updateMessage: string;
	deleteMessage: string;

	data: teacherDatatype[];
}

const teacherSlice = createSlice({
	name: 'teacher',
	initialState,
	reducers: {},
	extraReducers: builder => {
		// for fetching teachers
		builder.addCase(getAllTeachers.pending, getPending as CaseReducer);
		builder.addCase(getAllTeachers.rejected, getRejected as CaseReducer);
		builder.addCase(getAllTeachers.fulfilled, getFulfilled as unknown as CaseReducer);
		// for updating teacher
		builder.addCase(updateTeacher.pending, updatePending as CaseReducer);
		builder.addCase(updateTeacher.rejected, updateRejected as CaseReducer);
		builder.addCase(updateTeacher.fulfilled, updateFulfilled as unknown as CaseReducer);
		// for creating teacher
		builder.addCase(createTeacher.pending, createPending as CaseReducer);
		builder.addCase(createTeacher.rejected, createRejected as CaseReducer);
		builder.addCase(createTeacher.fulfilled, createFulfilled as unknown as CaseReducer);
		// for deleting teacher
		builder.addCase(deleteTeacher.pending, deletePending as CaseReducer);
		builder.addCase(deleteTeacher.rejected, deleteRejected as CaseReducer);
		builder.addCase(deleteTeacher.fulfilled, deleteFulfilled as unknown as CaseReducer);
	},
});

export default teacherSlice;
