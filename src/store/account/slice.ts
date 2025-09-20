import { CaseReducer, createSlice } from '@reduxjs/toolkit';
import { accountInfoType } from '../../utils/types';
import { getAccountInfo, pending, rejected, fulfilled } from './getAccountInfo';

const initialState: stateType = {
	fetching: 'standby',
	fetchMessage: '',
	data: {} as accountInfoType,
};

export interface stateType {
	fetching: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	fetchMessage: string;
	data: accountInfoType;
}

const accountSlice = createSlice({
	name: 'account',
	initialState,
	reducers: {},
	extraReducers: builder => {
		// for fetching accountInfo
		builder.addCase(getAccountInfo.pending, pending as CaseReducer);
		builder.addCase(getAccountInfo.rejected, rejected as CaseReducer);
		builder.addCase(getAccountInfo.fulfilled, fulfilled as unknown as CaseReducer);
	},
});

export default accountSlice;
