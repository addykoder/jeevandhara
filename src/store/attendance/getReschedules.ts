import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';

type expectedAPIResponseType = { status: string; message: string; payload: stateType['data'] };

export const getReschedules = createAsyncThunk('attendance/getReschedule', fetchReschedules);

async function fetchReschedules() {
	try {
		
		const resp = await axios.get(`${serverURL}/reschedule`);
		return resp.data;
	} catch (e) {
		console.log('some error reschedule/get thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.fetchingReschedules = 'pending';
}

export function rejected(state: stateType) {
	state.fetchingReschedules = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType }) {
	if (payload.status === 'ok') {
		state.data.reschedules = payload.payload.reschedules;
		state.data.notified = payload.payload.notified;
		state.data.day = payload.payload.day;
		state.data.preserve = payload.payload.preserve	
		state.data.preserveTill = payload.payload.preserveTill
		
		state.fetchingReschedules = 'fulfilled';
		state.fetchReschedulesMessage = payload.message;
	} else {
		state.fetchingReschedules = 'rejected';
		state.fetchReschedulesMessage = payload.message;
	}
}
