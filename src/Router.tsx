import { Route, Routes, HashRouter, useNavigate, Link } from 'react-router-dom';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
// import Test from './components/test/TestHook';
import Login from './pages/login/Login';
import Account from './pages/account/Account';
import Signup from './pages/signup/Signup';
// import Preferences from './pages/preferences/Preferences';
// import Classes from './pages/classes/Classes';
import { Suspense, useContext, useEffect, useState } from 'react';
import { attendancePageContext, teacherPageContext } from './App';
// import AllTeachers from './pages/AllTeachers/AllTeachers';
import React from 'react';
import Loader from './components/loader/Loader';
import SpecificTeacher from './pages/SpecificTeacher/SpecificTeacher';
import AddTeacher from './pages/AddTeacher/AddTeacher';
import UpdateTeacher from './pages/UpdateTeacher/UpdateTeacher';
import ViewAttendance from './pages/viewAttendance/ViewAttendance';
import DateAttendance from './pages/dateAttendance/DateAttendance';
import { Container, useMediaQuery } from '@mui/system';
import { Box, Button, TextField, Typography } from '@mui/material';
import TakeAttendance from './pages/takeAttendance/TakeAttendance';
import theme from './context/theme';
import Admin from './pages/admin/Admin';
import { useDispatch } from 'react-redux';
import { getAccountInfo } from './store/account/getAccountInfo';
import { AnyAction } from '@reduxjs/toolkit';
import ModifyReschedules from './pages/modifyReschedules/ModifyReschedules';

const Homepage = React.lazy(() => import('./pages/homepage/Homepage'));
const ViewReschedules = React.lazy(() => import('./pages/viewReschedules/ViewReschedules'));
const Classes = React.lazy(() => import('./pages/classes/Classes'));
const AllTeachers = React.lazy(() => import('./pages/AllTeachers/AllTeachers'));
const Preferences = React.lazy(() => import('./pages/preferences/Preferences'));
const TeacherEntry = React.lazy(() => import('./pages/TeacherEntry/TeacherEntry'));

function ReschedulePage() {
	const [username, setUsername] = useState('');
	const navigate = useNavigate();
	useEffect(() => {
		const savedUsername = localStorage.getItem('username');
		if (savedUsername) navigate(`/reschedules/${savedUsername}`);
	}, []);
	return (
		<Container maxWidth='xs' sx={{ display: 'flex', gap: 2, mt: 2, flexDirection: 'column' }}>
			<TextField
				fullWidth
				label='Enter School username'
				value={username}
				onChange={e => setUsername(e.target.value)}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						localStorage.setItem('username', username);
						navigate(`/reschedules/${username}`);
					}
				}}
			/>

			<Button
				fullWidth
				variant='contained'
				onClick={() => {
					navigate(`/reschedules/${username}`);
					localStorage.setItem('username', username);
				}}
			>
				Confirm
			</Button>
		</Container>
	);
}

// navigates to the admin dashboard
function DashboardIndex() {
	localStorage.setItem('index-page', '/dashboard');
	const navigate = useNavigate();
	useEffect(() => {
		navigate('/dashboard/admin');
	}, []);
	return <></>;
}

function IndexRedirector() {
	const navigate = useNavigate();

	const pageURL = localStorage.getItem('index-page') || '/homepage';
	useEffect(() => {
		navigate(pageURL);
	});

	return <></>;
}

// teacher page redirector
function TeacherRedirector() {
	const navigate = useNavigate();

	const [teacherPage] = useContext(teacherPageContext);
	useEffect(() => {
		navigate(teacherPage);
	});

	return <></>;
}

function AttendanceRedirector() {
	const navigate = useNavigate();

	const [attendancePage] = useContext(attendancePageContext);
	useEffect(() => {
		navigate(attendancePage);
	});

	return <></>;
}

export default function Router() {
	const dispatch = useDispatch();
	const [render, setRender] = useState(false);
	const isMobile = !useMediaQuery('(min-width:600px)');

	useEffect(() => {
		// here the things which have to be done before app renders
		// can be done in a separate tick
		// doing this because the useAccountInfo was being called several times by different components in the same rendering cycle, causing the fetching state not to be updated to 'pending' and remaining in 'standby' which caused multiple server requests by each hook call, so doing it here before any rendering happens to let redux serve a static data for all.
		dispatch(getAccountInfo() as unknown as AnyAction);
		setRender(true);
	}, []);

	if (!render) return <></>;
	return (
		<Suspense fallback={<Loader />}>
			<HashRouter>
				<Routes>
					{/* root path */}
					<Route path='/' element={<Header />}>
						<Route index element={<IndexRedirector />} />
						<Route
							path='/homepage'
							element={
								<Suspense fallback={<Loader />}>
									<Homepage />
								</Suspense>
							}
						/>
						{/* Open paths */}
						<Route path='/login' element={<Login />} />
						<Route path='/signup' element={<Signup />} />
						<Route path='/subscription' element={<h1>subscription</h1>} />

						<Route
							path='/teacher-entry'
							element={
								<Suspense fallback={<Loader />}>
									<TeacherEntry />
								</Suspense>
							}
						/>

						{/* entry route shortcut with link */}
						<Route
							path='/teacher-entry/:username'
							element={
								<Suspense fallback={<Loader />}>
									<TeacherEntry />
								</Suspense>
							}
						/>

						<Route path='/reschedules' element={<ReschedulePage />} />
						<Route
							path='/reschedules/:username'
							element={
								<Suspense fallback={<Loader />}>
									<ViewReschedules publicPage />
								</Suspense>
							}
						/>

						<Route path='/account' element={<Account />} />
						{/* Dashboard paths */}
						<Route path='/dashboard' element={<Sidebar />}>
							<Route index element={<DashboardIndex />} />
							<Route path='/dashboard/admin' element={<Admin />} />
							<Route path='/dashboard/account' element={<Account />} />
							<Route
								path='/dashboard/preferences'
								element={
									<Suspense fallback={<Loader />}>
										<Preferences />
									</Suspense>
								}
							/>
							<Route
								path='/dashboard/classes'
								element={
									<Suspense fallback={<Loader />}>
										<Classes />
									</Suspense>
								}
							/>
							<Route path='/dashboard/reschedules'>
								<Route
									path='/dashboard/reschedules'
									element={
										<Suspense fallback={<Loader />}>
											<ViewReschedules />
										</Suspense>
									}
								/>
								<Route path='/dashboard/reschedules/modify' element={<ModifyReschedules />} />
							</Route>
							<Route
								path='/dashboard/help'
								element={
									<>
										<Container>
											<h1 style={{textAlign: 'center'}}>Water Testing KIT.</h1>
											<div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', flexDirection: 'row' }}>
												<img style={{ borderRadius: 50, width: '550px' }} src='./public/kit.jpeg' alt='' />
												<img style={{ borderRadius: 50, width: '550px' }} src='./public/kit2.jpeg' alt='' />
											</div>


<Box sx={{ display: 'flex', marginTop:'6rem' , flexDirection: isMobile ? 'column' : 'row', gap: '4rem', alignItems: 'center', justifyContent: 'space-evenly' }}>
					<Box
						sx={{
							display: 'flex',
							maxWidth: isMobile ? '200px' : '300px',
							backgroundColor: 'rgb(0 255 228 / 5%)',
							padding: '2rem 4rem',
							borderRadius: '10px',
							flexDirection: 'column',
							// alignItems: 'center',
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '2rem' }}>
							<Typography variant='h4' sx={{ color: 'rgb(0 255 228)' }}>
								Basic Kit	
							</Typography>
							<Typography variant='h6' sx={{ ml: '6rem', fontWeight: 200 }}>
								₹ 1500
							</Typography>
						</Box>
						<Typography sx={{ color: 'grey' }}>
						</Typography>

						<Typography variant='h6' sx={{ fontWeight: 100, mt: '1rem' }}>
							Includes the basic functionality of PH and TDS sensing. and contains basic AI based outcome prediction.
						</Typography>

							<Typography variant='h5'>
								{new Date().getDate()} {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('default', { month: 'long' }).toLowerCase()},{' '}
								{new Date(new Date().setMonth(new Date().getMonth() + 1)).getFullYear()}
							</Typography>

						<Button
							variant='text'
							sx={{ mt: '3rem' }}
							onClick={() => {
								// generatePDF();
							}}
						>
							Get Info
						</Button>

						<Button variant='contained' sx={{ mt: '1rem', fontSize: '1.3rem' }} onClick={() => {}}>
							Buy Kit
						</Button>
					</Box>

					<Box
						sx={{
							display: 'flex',
							maxWidth: isMobile ? '200px' : '300px',
							backgroundColor: 'rgb(239 5 255  / 5%)',
							padding: '2rem 4rem',
							borderRadius: '10px',
							flexDirection: 'column',
							// alignItems: 'center',
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '2rem' }}>
							<Typography variant='h4' sx={{ color: 'rgb(179 0 192)' }}>
								Advance Kit
							</Typography>
							<Typography variant='h6' sx={{ ml: '6rem', fontWeight: 200 }}>
								₹ 15999
							</Typography>
						</Box>
						<Typography sx={{ color: 'grey' }}>
						</Typography>

						<Typography variant='h6' sx={{ fontWeight: 100, mt: '1rem' }}>
							Includes basic sensors + advance sensors like Dissolved Oxygen, Conductivity, Salinity, Turbidity etc. with advanced AI based outcome prediction
						</Typography>

						<Button
							variant='text'
							sx={{ mt: '3rem' }}
							onClick={() => {}}
						>
							Get Info
						</Button>

						<Button
							variant='contained'
							sx={{ mt: '1rem', fontSize: '1.3rem' }}
							onClick={() => {
								// createOrder('ann');
							}}
														
						>
							Buy Kit
						</Button>
					</Box>
				</Box>
									</Container>
									</>
								}
							/>
							{/* Teacher routes */}
							<Route path='/dashboard/teacher' element={<TeacherRedirector />} /> {/* Redirector */}
							<Route
								path='/dashboard/teacher/view'
								element={
									<Suspense fallback={<Loader />}>
										<AllTeachers />
									</Suspense>
								}
							/>
							<Route path='/dashboard/teacher/view/:id' element={<SpecificTeacher />} />
							<Route path='/dashboard/teacher/add' element={<AddTeacher />} />
							<Route path='/dashboard/teacher/update/:id' element={<UpdateTeacher />} />
							{/* Attendance routes */}
							<Route path='/dashboard/attendance' element={<AttendanceRedirector />} />
							<Route path='/dashboard/attendance/view' element={<ViewAttendance />} />
							<Route path='/dashboard/attendance/view/:date' element={<DateAttendance />} />
							<Route path='/dashboard/attendance/take' element={<TakeAttendance />} />
							<Route path='/dashboard/attendance/history' element={<h1>attendance history</h1>} />
						</Route>
					</Route>
					{/* happy 404 */}
					<Route
						path='*'
						element={
							<Container maxWidth='xl' sx={{ display: 'flex', gap: 2, mt: 2, flexDirection: 'column' }}>
								<Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
									<Typography component='h1' variant='h1' sx={{ textAlign: 'center' }}>
										<span style={{ opacity: 0.4, fontFamily: 'cursive' }}>Yay... It's a </span> 404
									</Typography>
									<Typography sx={{ mt: 2, fontWeight: 200, textAlign: 'center' }} variant='h4' color='primary'>
										Seems like you are lost, Maybe the link you followed was broken.
									</Typography>
									<Link to='/homepage' style={{ marginTop: '2em', color: theme.primary, fontSize: '2rem' }}>
										Home
									</Link>
								</Box>
							</Container>
						}
					/>
				</Routes>
			</HashRouter>
		</Suspense>
	);
}
