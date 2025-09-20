import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';

type expectedAPIResponseType = { status: string; message: string; payload: { classes: stateType['data'] } };

export const getClasses = createAsyncThunk('classes/get', fetchClassses);

async function fetchClassses() {
	try {
		const resp = await axios.get(`${serverURL}/classes`);
		return resp.data;
	} catch (e) {
		console.log('some error classes/get thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.fetching = 'pending';
}

export function rejected(state: stateType) {
	state.fetching = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType }) {
	if (payload.status === 'ok') {
		state.data = payload.payload.classes
		state.fetching = 'fulfilled';
		state.updating = 'standby'
		state.fetchMessage = payload.message;
	} else {
		state.fetching = 'rejected';
		state.fetchMessage = payload.message;
	}
}
