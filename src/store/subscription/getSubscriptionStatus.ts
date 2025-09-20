import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';

type expectedAPIResponseType = { status: string; message: string; payload: object }

export const getSubscriptionStatus = createAsyncThunk('subscription/getStatus', fetchSubscriptionStatus);

async function fetchSubscriptionStatus() {
	try {
		const resp = await axios.get(`${serverURL}/subscription/status`);
		return resp.data;
	} catch (e) {
		console.log('some error subscription/getStatus thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.fetchingStatus = 'pending';
}

export function rejected(state: stateType) {
	state.fetchingStatus = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType}) {

	if (payload.status === 'ok') {
		state.data.status = payload.message;
		state.fetchStatusMessage = payload.message;
		state.fetchingStatus = 'fulfilled';

	} else {
		state.fetchingStatus = 'rejected';
		state.fetchStatusMessage = payload.message;
	}
}
