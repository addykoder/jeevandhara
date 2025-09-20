import { AnyAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../store';
import { getSubscriptionHistory } from './getSubscriptionHistory';

type hookReturnType = [object[], string, string];

// custom hook for using the subsction Status functionalities
export default function useSubscriptionHistory(): hookReturnType {
	const dispatch = useDispatch();
	const { data, fetchHistoryMessage, fetchingHistory } = useSelector((state: rootState) => state.subscription);

	// initially fetching the status
	// only if history is not yet fetched
	useEffect(() => {
		if (fetchingHistory === 'standby') {
			dispatch(getSubscriptionHistory() as unknown as AnyAction);
		}	
	}, []);

	return [ data.history, fetchingHistory, fetchHistoryMessage];
}