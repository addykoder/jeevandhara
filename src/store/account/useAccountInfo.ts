import { AnyAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../store';
import { getAccountInfo } from './getAccountInfo';

// custom hook for using the subscription Status functionalities
export default function useAccountInfo(): [
	{
		isAdmin: boolean;
		username: string;
		schoolName: string;
		adminName: string;
		phone: number;
		email: string;
		subscription: {
			expiresOn: Date[],
			rescheduleCount: number
		}

	},
	string,
	string, 
	()=>void
] {
	const dispatch = useDispatch();
	const { data, fetching, fetchMessage } = useSelector((state: rootState) => state.account);

	// initially fetching the status
	useEffect(() => {
		if (fetching === 'standby') {
			// setting a timeout to give some time for
			// app to load the axios headers
			dispatch(getAccountInfo() as unknown as AnyAction);
		}
	}, []);

	const refetch = () => {
		dispatch(getAccountInfo() as unknown as AnyAction);
	}

	return [{ ...data.school, isAdmin: data.isAdmin }, fetching, fetchMessage, refetch];
}
