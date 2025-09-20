import { AnyAction } from '@reduxjs/toolkit';
import axios, { AxiosHeaders } from 'axios';
import { useDispatch } from 'react-redux';
import { getAccountInfo } from '../store/account/getAccountInfo';
import { serverURL } from '../utils/constants';
import useSavedToken from './useSavedToken2';
import useToast from './useToast';

export default function useLogin(): [(username: string, password: string) => Promise<void>, () => Promise<void>] {
	const [, setToken] = useSavedToken();
	const dispatch = useDispatch();
	const notify = useToast();

	// login handler
	async function login(username: string, password: string) {
		const response = await axios.post(`${serverURL}/auth/login`, { username, password }).catch(() => {
			notify('error', 'Cannot connect to the server');
		});
		if (response?.data.status === 'ok') {
			const token = response.data.payload.token;
			// will do the following if login information changes
			// reset the axios default headers for future requests
			axios.defaults.headers.common['token'] = token as unknown as AxiosHeaders;
			// save new token
			setToken(token);

			dispatch(getAccountInfo() as unknown as AnyAction);
			notify('success', `Successfully logged in as ${response.data.payload.as}`);
			// navigate('/dashboard');
			document.location.href = '/#/dashboard'
			// refetch the new account data
		} else {
			notify('error', response?.data.message);
		}
	}

	// logout handler: simply clears the localhost token and hard redirects to login
	async function logout() {
		// setToken('');
		// clearing localStorage on logout
		localStorage.clear()
		window.location.href = '/';
	}

	return [login, logout];
}
