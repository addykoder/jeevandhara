import { AnyAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../store';
import { getPreferences } from './getPreferences';
import { stateType } from './slice';
import { updatePreferences } from './updatePreferences';

type hookReturnType = [stateType['data'], (preference: stateType['data']) => Promise<void>, ()=>void, string, string, string, string];

// custom hook for using the preference functionalities
export default function usePreference(): hookReturnType {
	const dispatch = useDispatch();
	const { fetching, updating, updateMessage, fetchMessage, data } = useSelector((state: rootState) => state.preference);

	// initially fetching the preferences
	// only if not yet fetched
	useEffect(() => {
		if (fetching === 'standby') {
			dispatch(getPreferences() as unknown as AnyAction);
		}
	}, []);

	// refetching whenever the data is updated by the client
	// only if preferences were already fetched
	useEffect(() => {
		if (updating === 'fulfilled' && fetching === 'fulfilled') {
			dispatch(getPreferences() as unknown as AnyAction);
		}
	}, [updating]);

	async function updatePreferencesHandler(preference: stateType['data']) {
		dispatch(updatePreferences(preference) as unknown as AnyAction);
	}

	function refetch() {
			dispatch(getPreferences() as unknown as AnyAction);
		}

	return [data, updatePreferencesHandler, refetch, fetching, updating, updateMessage, fetchMessage];
}
