import { createAsyncThunk } from '@reduxjs/toolkit';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';
import axios from 'axios';

type expectedAPIResponseType = { status: string; message: string };

export const confirmReschedules = createAsyncThunk('attendance/confirmReschedule', fetchConfirmReschedules);

async function fetchConfirmReschedules() {
	try {
		const resp = await axios.post(`${serverURL}/reschedule/confirmNotify`);
		return resp.data;
	} catch (e) {
		console.log('some error reschedule/confirm thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.confirmingReschedules = 'pending';
}

export function rejected(state: stateType) {
	state.confirmingReschedules = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType }) {
	if (payload.status === 'ok') {
		state.confirmingReschedules = 'fulfilled';
		state.confirmMessage = payload.message;
	} else {
		state.confirmingReschedules = 'rejected';
		state.confirmMessage = payload.message;
	}
}
