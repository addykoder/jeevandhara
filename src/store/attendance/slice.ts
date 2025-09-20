import { CaseReducer, createSlice } from '@reduxjs/toolkit';
import { getReschedules, pending as getRescPending, rejected as getRescRejected, fulfilled as getRescFulfilled } from './getReschedules';
import { confirmReschedules, pending as confirmPending, rejected as confirmRejected, fulfilled as confirmFulfilled } from './confirmReschedules';
import { submitAttendance, pending as submitPending, rejected as submitRejected, fulfilled as submitFulfilled } from './submitAttendance';
import { getAttendance, pending as getAttPending, rejected as getAttRejected, fulfilled as getAttFulfilled } from './getAttendance';
import { attendanceDatatype, notifiedDatatype, reschedulesDatatype } from '../../utils/types';
import { regenerateReschedules, pending as regeneratePending, rejected as regenerateRejected, fulfilled as regenerateFulfilled } from './regenerateReschedules';

const initialState: stateType = {
	fetchingReschedules: 'standby',
	fetchingAttendance: 'standby',
	confirmingReschedules: 'standby',
	submittingAttendance: 'standby',
	submitAttendanceMessage: '',
	confirmMessage: '',
	fetchReschedulesMessage: '',
	fetchAttendanceMessage: '',
	data: { reschedules: [], notified: [], attendance:[], day:0, preserve: false, preserveTill: 0 },
};

export interface stateType {
	fetchingReschedules: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	fetchingAttendance: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	confirmingReschedules: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	submittingAttendance: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	submitAttendanceMessage: string;
	confirmMessage: string;
	fetchReschedulesMessage: string;
	fetchAttendanceMessage: string;
	data: {
		day: number; reschedules: reschedulesDatatype[]; notified: notifiedDatatype[]; attendance: attendanceDatatype[] | null; preserve: boolean, preserveTill: number
};
}

const attendanceSlice = createSlice({
	name: 'attendance',
	initialState,
	reducers: {},
	extraReducers: builder => {
		// for fetching reshedule
		builder.addCase(getReschedules.pending, getRescPending as CaseReducer);
		builder.addCase(getReschedules.rejected, getRescRejected as CaseReducer);
		builder.addCase(getReschedules.fulfilled, getRescFulfilled as unknown as CaseReducer);
		// for fetching attendance
		builder.addCase(getAttendance.pending, getAttPending as CaseReducer);
		builder.addCase(getAttendance.rejected, getAttRejected as CaseReducer);
		builder.addCase(getAttendance.fulfilled, getAttFulfilled as unknown as CaseReducer);
		// for updating reschedule
		builder.addCase(confirmReschedules.pending, confirmPending as CaseReducer);
		builder.addCase(confirmReschedules.rejected, confirmRejected as CaseReducer);
		builder.addCase(confirmReschedules.fulfilled, confirmFulfilled as unknown as CaseReducer);
		// for submitting attendance
		builder.addCase(submitAttendance.pending, submitPending as CaseReducer);
		builder.addCase(submitAttendance.rejected, submitRejected as CaseReducer);
		builder.addCase(submitAttendance.fulfilled, submitFulfilled as unknown as CaseReducer);
		// for regenerating attendance
		builder.addCase(regenerateReschedules.pending, regeneratePending as CaseReducer);
		builder.addCase(regenerateReschedules.rejected, regenerateRejected as CaseReducer);
		builder.addCase(regenerateReschedules.fulfilled, regenerateFulfilled as unknown as CaseReducer);
	},
});

export default attendanceSlice;
