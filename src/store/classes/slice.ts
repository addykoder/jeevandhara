import { CaseReducer, createSlice } from '@reduxjs/toolkit';
import { classesObjectType } from '../../utils/types';
import { getClasses, pending as getPending, rejected as getRejected, fulfilled as getFulfilled } from './getClasses';
import { updateClasses, pending as updatePending, rejected as updateRejected, fulfilled as updateFulfilled } from './updateClasses';

const initialState: stateType = {
	fetching: 'standby',
	updating: 'standby',
	updateMessage: '',
	fetchMessage: '',
	data: [],
};

export interface stateType {
	fetching: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	updating: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	updateMessage: string;
	fetchMessage: string;
	data: classesObjectType[];
}

const classesSlice = createSlice({
	name: 'classes',
	initialState,
	reducers: {},
	extraReducers: builder => {
		// for fetching classes
		builder.addCase(getClasses.pending, getPending as CaseReducer);
		builder.addCase(getClasses.rejected, getRejected as CaseReducer);
		builder.addCase(getClasses.fulfilled, getFulfilled as unknown as CaseReducer);
		// for updating classes
		builder.addCase(updateClasses.pending, updatePending as CaseReducer);
		builder.addCase(updateClasses.rejected, updateRejected as CaseReducer);
		builder.addCase(updateClasses.fulfilled, updateFulfilled as unknown as CaseReducer);
	},
});

export default classesSlice;
