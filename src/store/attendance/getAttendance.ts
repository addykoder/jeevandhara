import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';

type expectedAPIResponseType = { status: string; message: string; payload: stateType['data'] };

export const getAttendance = createAsyncThunk('attendance/get', fetchAttendance);

async function fetchAttendance() {
	try {
		const resp = await axios.get(`${serverURL}/attendance`);
		return resp.data;
	} catch (e) {
		console.log('some error reschedule/getAttendance thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.fetchingAttendance = 'pending';
}

export function rejected(state: stateType) {
	state.fetchingAttendance = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType }) {
	if (payload.status === 'ok') {
		state.data.attendance = payload.payload.attendance;
		state.fetchingAttendance = 'fulfilled';
		state.fetchAttendanceMessage = payload.message;
		state.submittingAttendance = 'standby'
	} else {
		state.fetchingAttendance = 'rejected';
		state.fetchAttendanceMessage = payload.message;
	}
}
