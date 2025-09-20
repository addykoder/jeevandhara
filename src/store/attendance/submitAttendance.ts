import { createAsyncThunk } from '@reduxjs/toolkit';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';
import axios from 'axios';

type expectedAPIResponseType = { status: string; message: string;}

export const submitAttendance = createAsyncThunk('attendance/submit', fetchSubmitAttendance);

async function fetchSubmitAttendance({ attendance, day, preserve, preserveTill }: { attendance: object[], day: number, preserve:boolean, preserveTill: number }) {
	try {
		const resp = await axios.post(`${serverURL}/attendance`, { attendance, day, preserve, preserveTill });
		return resp.data;
	} catch (e) {
		console.log('some error reschedule/submitAttendance thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.submittingAttendance = 'pending';
}

export function rejected(state: stateType) {
	state.submittingAttendance = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType }) {

	if (payload.status === 'ok') {
		state.submittingAttendance = 'fulfilled';
		state.submitAttendanceMessage = payload.message;
	} else {
		state.submittingAttendance = 'rejected';
		state.submitAttendanceMessage = payload.message;
	}
}
