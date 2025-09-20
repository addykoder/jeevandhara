import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';

type expectedAPIResponseType = { status: string; message: string; payload: {[key:string]:object} }

export const getAttendanceHistory = createAsyncThunk('attendanceHistory/get', fetchAttendanceHistory);

async function fetchAttendanceHistory() {
	try {
		const resp = await axios.get(`${serverURL}/attendance/history`);
		return resp.data;
	} catch (e) {
		console.log('some error attendanceHistory/get thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.fetching = 'pending';
}

export function rejected(state: stateType) {
	state.fetching = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType}) {

	if (payload.status === 'ok') {
		state.data = payload.payload;
		state.fetching = 'fulfilled';
		state.fetchMessage = payload.message;

	} else {
		state.fetching = 'rejected';
		state.fetchMessage = payload.message;
	}
}
