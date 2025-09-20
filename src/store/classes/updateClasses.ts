import { createAsyncThunk } from '@reduxjs/toolkit';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';
import axios from 'axios';

type expectedAPIResponseType = { status: string; message: string;}

export const updateClasses = createAsyncThunk('classes/update', fetchUpdateClasses);

async function fetchUpdateClasses(classes: stateType['data']) {
	try {
		const resp = await axios.post(`${serverURL}/classes/update`, { classes });
		return resp.data;
	} catch (e) {
		console.log('some error classes/update thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.updating = 'pending';
}

export function rejected(state: stateType) {
	state.updating = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType }) {

	if (payload.status === 'ok') {
		state.updating = 'fulfilled';
		state.updateMessage = payload.message;
	} else {
		state.updating = 'rejected';
		state.updateMessage = payload.message;
	}
}
