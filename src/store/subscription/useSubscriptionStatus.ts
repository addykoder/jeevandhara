import { AnyAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../store';
import { getSubscriptionStatus } from './getSubscriptionStatus';

type hookReturnType = [string, string, string];

// custom hook for using the subsction Status functionalities
export default function useSubscriptionStatus(): hookReturnType {
	const dispatch = useDispatch();
	const { data, fetchStatusMessage, fetchingStatus } = useSelector((state: rootState) => state.subscription);

	// initially fetching the status
	useEffect(() => {
		// only if data is not yet fetched i.e. in standby
		if (fetchingStatus === 'standby') {
			dispatch(getSubscriptionStatus() as unknown as AnyAction);
		}
	}, []);

	return [ data.status, fetchingStatus, fetchStatusMessage ];
}
