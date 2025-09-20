import { CaseReducer, createSlice } from '@reduxjs/toolkit';
import { getAttendanceHistory, pending, rejected, fulfilled } from './getAttendanceHistory';

const initialState: stateType = {
	fetching: 'standby',
	fetchMessage: '',
	data: {},
};

export interface stateType {
	fetching: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	fetchMessage: string;
	data: { [key: string]: object };
}

const attendanceHistorySlice = createSlice({
	name: 'attendanceHistory',
	initialState,
	reducers: {},
	extraReducers: builder => {
		// for fetching attendanceHistory
		builder.addCase(getAttendanceHistory.pending, pending as CaseReducer);
		builder.addCase(getAttendanceHistory.rejected, rejected as CaseReducer);
		builder.addCase(getAttendanceHistory.fulfilled, fulfilled as unknown as CaseReducer);
	},
});

export default attendanceHistorySlice;
