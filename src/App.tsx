import Router from './Router';
import { ProSidebarProvider } from 'react-pro-sidebar';
import theme from './context/theme';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './global.style';
import useSidebarState, { sidebarStateContext } from './hooks/useSidebarState';
import { Provider as StoreProvider } from 'react-redux';

import store from './store/store';
import axios from 'axios';
import { useState } from 'react';
import { ThemeProvider as MUIProvider, createTheme } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createContext } from 'react';
import './entry.css';
import './display.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Load from './components/loadAnimate/Load';

const darkTheme = createTheme({
	typography: {
		fontFamily: [
			'IBM Plex Sans',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
	},
	palette: {
		mode: 'dark',
		primary: {
			main: '#1976d2',
			light: '#1976d24d',
		},
		secondary: {
			main: '#494c7d',
		},
	},
});

export const teacherPageContext = createContext<[string, (page: string) => void]>([
	'/dashboard/teacher/view',
	(n: string) => {
		n;
	},
]);
export const attendancePageContext = createContext<[string, (page: string) => void]>([
	'/dashboard/attendance/view',
	(n: string) => {
		n;
	},
]);
export const toastContext = createContext(toast);

axios.defaults.headers.common['token'] = localStorage.getItem('token'); // for all requests

export default function App() {
	const [state, toggleState] = useSidebarState(false);
	const [teacherPage, setTeacherPage] = useState('/dashboard/teacher/view');
	const [attendancePage, setAttendancePage] = useState('/dashboard/attendance/view');

	return (
		<div className='App'>
			{/* conditionally rendering the loader only if the last loading animation was done at least 1 minute ago */}
			{(Number(new Date()) - Number((localStorage.getItem('load-timeout') || '0')) ) > 600000?<Load onStart={() => 0} onLoad={() => localStorage.setItem('load-timeout', String(Number(new Date())))} /> : ''}

			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<teacherPageContext.Provider value={[teacherPage, setTeacherPage]}>
					<attendancePageContext.Provider value={[attendancePage, setAttendancePage]}>
						<toastContext.Provider value={toast}>
							<MUIProvider theme={darkTheme}>
								<StoreProvider store={store}>
									<sidebarStateContext.Provider value={[state, toggleState]}>
										<ProSidebarProvider>
											<ThemeProvider theme={theme}>
												<GlobalStyle />
												<Router />
											</ThemeProvider>
										</ProSidebarProvider>
									</sidebarStateContext.Provider>
								</StoreProvider>
							</MUIProvider>
							<ToastContainer />
						</toastContext.Provider>
					</attendancePageContext.Provider>
				</teacherPageContext.Provider>
			</LocalizationProvider>
		</div>
	);
}
