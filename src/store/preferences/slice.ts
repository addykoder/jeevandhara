import { CaseReducer, createSlice } from '@reduxjs/toolkit';
import { preferenceOverwriteType } from '../../utils/types';
import { getPreferences, pending as getPending, rejected as getRejected, fulfilled as getFulfilled } from './getPreferences';
import { updatePreferences, pending as updatePending, rejected as updateRejected, fulfilled as updateFulfilled } from './updatePreferences';

const initialState: stateType = {
	fetching: 'standby',
	updating: 'standby',
	updateMessage: '',
	fetchMessage: '',
	data: {},
};

export interface stateType {
	fetching: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	updating: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	updateMessage: string;
	fetchMessage: string;
	// data: { [key: string]: string | boolean | object | number };
	data: preferenceOverwriteType;
}

const preferenceSlice = createSlice({
	name: 'preference',
	initialState,
	reducers: {},
	extraReducers: builder => {
		// for fetching preferences
		builder.addCase(getPreferences.pending, getPending as CaseReducer);
		builder.addCase(getPreferences.rejected, getRejected as CaseReducer);
		builder.addCase(getPreferences.fulfilled, getFulfilled as unknown as CaseReducer);
		// for updating preferences
		builder.addCase(updatePreferences.pending, updatePending as CaseReducer);
		builder.addCase(updatePreferences.rejected, updateRejected as CaseReducer);
		builder.addCase(updatePreferences.fulfilled, updateFulfilled as unknown as CaseReducer);
	},
});

export default preferenceSlice;