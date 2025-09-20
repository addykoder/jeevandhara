import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';

type expectedAPIResponseType = { status: string; message: string; payload: { preferences: stateType['data'] } }

export const getPreferences = createAsyncThunk('preference/get', fetchPreferences);

async function fetchPreferences() {
	try {
		const resp = await axios.get(`${serverURL}/preference`);
		return resp.data;
	} catch (e) {
		console.log('some error preference/get thunc callback function');
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
		state.data = payload.payload.preferences;
		state.fetching = 'fulfilled';
		// to fix a bug causing to refetch on every render
		state.updating = 'standby'
		state.fetchMessage = payload.message;

	} else {
		state.fetching = 'rejected';
		state.fetchMessage = payload.message;
	}
}
