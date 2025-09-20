import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import theme from '../../context/theme';
import Loader from '../../components/loader/Loader';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import useToast from '../../hooks/useToast';
import TimeTableEntry from '../../components/timetableEntry/TimeTableEntry';
import { classesObjectType, teacherTimetable } from '../../utils/types';
import { createArr} from '../AddTeacher/AddTeacher';
import { useParams } from 'react-router-dom';

export default function TeacherEntry() {
	const [verified, setVerified] = useState(false);
	const [verifying, setVerifying] = useState(false);
	const [username, setUsername] = useState('');
	const [data, setData] = useState<{ [key: string]: string }>();
	const notify = useToast();
	const [saving, setSaving] = useState(false);
	const [success, setSuccess] = useState(false);

	const params = useParams();
	useEffect(() => {
		if (params.username) {
			handleVerify(params.username);
		}
	}, []);

	const weekdayPeriod = (data?.preferences as unknown as { [key: string]: number })?.weekdayPeriod;
	const saturdayPeriod = (data?.preferences as unknown as { [key: string]: number })?.saturdayPeriod;

	const [name, setName] = useState('');
	const [Class, setClass] = useState('free');
	// const [maxClass, setMaxClass] = useState('.');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [timeTable, setTimeTable] = useState<teacherTimetable>({
		mon: [],
		tue: [],
		wed: [],
		thu: [],
		fri: [],
		sat: [],
	});

	useEffect(() => {
		setTimeTable({
			mon: createArr(weekdayPeriod as number),
			tue: createArr(weekdayPeriod as number),
			wed: createArr(weekdayPeriod as number),
			thu: createArr(weekdayPeriod as number),
			fri: createArr(weekdayPeriod as number),
			sat: createArr(saturdayPeriod as number),
		});
	}, [data]);

	async function handleVerify(un?: string) {
		const uname = un || username;
		if (!uname) return notify('info', 'Please fill out the username first');

		setVerifying(true);
		const resp = await axios.post(`${serverURL}/entry/getSchoolInfo`, { username: uname }).catch(() => {
			setVerifying(false);
			notify('error', 'Some error occurred');
		});
		if (!resp) return [setVerifying(false), notify('error', 'Cannot fetch server')];
		if (resp.data.status === 'ok') {
			setVerified(true);
			setVerifying(false);
			setData(resp.data.payload);
			return 'ok';
		} else {
			setVerifying(false);
			notify('error', resp.data.message || 'Some error occurred');
		}
	}

	const maxP = saturdayPeriod > weekdayPeriod ? saturdayPeriod : weekdayPeriod;
	const periodArray: number[] = [];
	for (let i = 1; i <= maxP; i++) {
		periodArray.push(i);
	}

	async function handleSave() {
		const resp = await axios.post(`${serverURL}/entry/submitTeacherData`, {
			name,
			classTeacherOf: Class,
			// setting max class default to '.' for max as not needed now
			maxTeachingClass: '.',
			timeTable,
			messagingPreference: 'sms',
			phone: Number(phone),
			username: data?.username,
			password,
		});

		if (resp.data.status === 'ok') {
			setSaving(false);
			setSuccess(true);
			notify('success', 'Data Successfully submitted');
			localStorage.setItem('teacher-entry-submitted-24', 'ok');
		} else {
			setSaving(false);
			notify('error', resp.data.message || 'Some error while submitting');
		}
	}

	function onAddHandler() {
		// validating fields
		if (name.replaceAll(' ', '') === '') return notify('error', 'Name cannot be empty');
		if (!(data?.classes as unknown as { name: string }[]).map(c => c.name).includes(Class) && Class !== 'free') return notify('error', 'Invalid class selected');
		// if (!(data?.classes as unknown as { name: string }[]).map(c => c.name).includes(maxClass) && maxClass !== '.') return notify('error', 'Invalid Max class');
		if (!/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(phone)) return notify('error', 'Invalid phone number');
		if (password.length < 4) return notify('error', 'Password is too small, use atleast 4 characters');

		if (!confirm('Rechecked the submitted data for any errors or irregularities ? Continue submitting ?')) return;

		setSaving(true);
		handleSave();
	}

	if (success || localStorage.getItem('teacher-entry-submitted-24') === 'ok')
		return (
			<>
				<Typography variant='h2' color='primary' sx={{ fontFamily: 'cursive', fontWeight: 600, textAlign: 'center', mt: 4 }}>
					Thanks...
				</Typography>
				<Typography variant='h5' sx={{ fontSize: '1.4rem', mt: 2, textAlign: 'center', fontWeight: 300, opacity: '.6' }}>
					Your Data has been saved and will contribute in a more productive functioning of the System.
				</Typography>
				<Typography variant='h5' color='primary' sx={{ mt: 4, textAlign: 'center', fontWeight: 300 }}>
					You can now safely close the Application.
				</Typography>
				<Typography variant='body1' sx={{ opacity: 0.6, textAlign: 'center', fontWeight: 300 }}>
					Want to resubmit or modify already submitted data? contact the Admin.
				</Typography>
			</>
		);

	if (!verified)
		return (
			<>
				<Typography variant='h5' color='primary' sx={{ mt: 2, mb: 1, textAlign: 'center' }}>
					Fill out your School's username
				</Typography>
				<span style={{ marginBottom: '1em', textAlign: 'center', opacity: '.6', fontWeight: 200 }}>Don't know the USERNAME ? Ask the manager / Admin of your school.</span>
				<Container maxWidth='sm' sx={{ py: 2, borderRadius: 2 }}>
					<Container maxWidth='sm' sx={{ background: theme.bgradient, py: 6, borderRadius: 2 }}>
						<TextField fullWidth label='School username' value={username} onChange={e => setUsername(e.target.value.toLowerCase())} sx={{ mb: 4 }} />
						<Button disabled={verifying} onClick={() => handleVerify()} fullWidth variant='contained' sx={{ py: 1 }}>
							{verifying ? <Loader height={30} width={30} /> : 'Confirm'}
						</Button>
					</Container>
				</Container>
			</>
		);

	return (
		<>
			<Container maxWidth='lg' sx={{ mb: 8 }}>
				<Typography variant='h3' color='grey' sx={{ textAlign: 'center', my: 4 }}>
					{data?.schoolName}
				</Typography>
				<Typography variant='h5' color='primary' sx={{ textAlign: 'center', mb: 4 }}>
					Please fill out the following Information
				</Typography>

				<Box className='addTeacher'>
					<Box className='infoGrid' sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 5 }}>
						<TextField label='Your Name' value={name} onChange={e => setName(e.target.value)} />
						{/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
							<FormControl sx={{ flex: '1', minWidth: '200px' }}>
								<InputLabel id='demo-simple-select-label'>Teaching Category</InputLabel>
								<Select
									value={category}
									labelId='demo-simple-select-label'
									onChange={e => setCategory(e.target.value as teacherCategory)}
									id='demo-simple-select'
									label='Teaching Category'
								>
									<MenuItem value='subjunior'>Sub-Junior - (class PG to 2nd)</MenuItem>
									<MenuItem value='junior'>Junior - (class 3rd to 6th)</MenuItem>
									<MenuItem value='senior'>Senior - (class 7th to 10th)</MenuItem>
									<MenuItem value='pgt'>PGT - (11th and 12th)</MenuItem>
								</Select>
							</FormControl>
							<span style={{ opacity: '.6', fontWeight: 200 }}>Which category of students you mostly teach ?</span>
						</Box> */}

						<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
							<FormControl sx={{ flex: '1', minWidth: '200px' }}>
								<InputLabel id='demo-simple-select-label'>Class Teacher of</InputLabel>
								<Select value={Class} onChange={e => setClass(e.target.value as string)} id='demo-simple-select' label='Class Teacher of'>
									<MenuItem value='free'>None</MenuItem>
									{(data?.classes as unknown as { name: string }[]).map(c => (
										<MenuItem key={c.name} value={c.name}>
											{c.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<span style={{ opacity: '.6', fontWeight: 200 }}>Are you a Class Teacher? select None if not, else select your class</span>
						</Box>

						<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
							<TextField
								label='Phone'
								value={`+91 ${phone}`}
								onChange={e => {
									if (Number.isNaN(Number(e.target.value.slice(4, e.target.value.length)))) return;
									setPhone(e.target.value.slice(4, e.target.value.length));
								}}
							/>
							<span style={{ opacity: '.6', fontWeight: 200 }}>Your contact information will be used to notify you about your substitutions</span>
						</Box>

						<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
							<TextField label='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
							<span style={{ opacity: '.6', fontWeight: 200 }}>A small 4 - 8 letter password to allow you login later to view or update your information</span>
						</Box>
					</Box>
					{/* removed level selection for now */}
					{/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
							<Box className='maxTeachingClass'>
								<Typography color='primary' sx={{ pb: 2 }}>
									Select The Maximum class upto which you are comfortable being alloted a substitution to : (Your preferred classes will be highlighted in blue)
								</Typography>
								<Box sx={{ mb: 2, display: 'flex', gap: '.5em', flexWrap: 'wrap' }} className='classes'>
									{(data?.classes as unknown as { name: string; handlingLevel: number }[])
										.sort((c1, c2) => (c1.handlingLevel > c2.handlingLevel ? 1 : c1.handlingLevel === c2.handlingLevel ? 0 : -1))
										.map(c => (
											<Box
												onClick={() => {
													setMaxClass(c.name);
												}}
												className='point'
												key={c.name}
												sx={{
													py: '.5em',
													px: '1em',
													background: c.handlingLevel <= maxCL(data?.classes as unknown as classesObjectType[], maxClass) ? theme.primary : 'grey',
													opacity: c.handlingLevel <= maxCL(data?.classes as unknown as classesObjectType[], maxClass) ? '1' : '.3',
													borderRadius: 2,
												}}
											>
												{c.name}
											</Box>
										))}
								</Box>
							</Box>
							<span style={{ opacity: '.6', fontWeight: 200 }}>Till what class are you comfortable to be assigned a substitution to ?</span>
							<span style={{ opacity: '.6', fontWeight: 200 }}>NOTE : This will not effect the number of substitutions you will be assigned</span>
						</Box>
					</Box> */}
					<Typography color='primary' sx={{ mt: 8 }}>
						Please take a minute and Fill out your TimeTable
					</Typography>
					<div className='tableEntry'>
						<TimeTableEntry
							pub={true}
							classes={data?.classes as unknown as classesObjectType[]}
							periods={periodArray}
							timetable={timeTable as teacherTimetable}
							setTimetable={setTimeTable}
						/>
					</div>
				</Box>
				<Button fullWidth sx={{ py: 1, mt: 4, mb: 10 }} onClick={onAddHandler} variant='outlined'>
					{saving ? <Loader height={30} width={30} /> : 'Confirm Details'}
				</Button>
			</Container>
		</>
	);
}
