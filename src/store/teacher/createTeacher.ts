import { createAsyncThunk } from '@reduxjs/toolkit';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';
import axios from 'axios';
import { verifyTeacherDatatype } from '../../utils/types';

type expectedAPIResponseType = { status: string; message: string };

export const createTeacher = createAsyncThunk('teacher/create', fetchCreateTeacher);

async function fetchCreateTeacher(data: verifyTeacherDatatype) {
	try {
		const resp = await axios.post(`${serverURL}/teacher`, data);
		return resp.data;
	} catch (e) {
		console.log('some error teacher/create thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.creating = 'pending';
}

export function rejected(state: stateType) {
	state.creating = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType }) {
	if (payload.status === 'ok') {
		state.creating = 'fulfilled';
		state.createMessage = payload.message;
	} else {
		state.creating = 'rejected';
		state.createMessage = payload.message;
	}
}
