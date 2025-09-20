import { Box, Button, Container, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { teacherPageContext } from '../../App';
import useTeacher from '../../store/teacher/useTeacher';
import { classesObjectType, teacherCategory, teacherTimetable } from '../../utils/types';
import { ArrowBack, SaveOutlined } from '@mui/icons-material';
import useClasses from '../../store/classes/useClasses';
import theme from '../../context/theme';
import TimeTableEntry from '../../components/timetableEntry/TimeTableEntry';
import usePreference from '../../store/preferences/usePreference';
import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import Loader from '../../components/loader/Loader';

export function createArr(n: number) {
	const a = [];
	for (let i = 0; i < n; i++) a.push('free');
	return a;
}

export function maxCL(classes: classesObjectType[], name: string) {
	if (name === '.') return Infinity;
	for (const c of classes) {
		if (c.name === name) return c.handlingLevel;
	}
	return -Infinity;
}

export default function AddTeacher() {
	const [{ saturdayPeriod, weekdayPeriod }] = usePreference();
	const isSmall = !useMediaQuery('(min-width:900px)');
	const [classes] = useClasses();
	const notify = useToast();
	const notified = useRef(true);

	const [, setTeacherPage] = useContext(teacherPageContext);
	const [, , createTeacher, , , , creating, , , , createMessage] = useTeacher();
	const [saving, setSaving] = useState(false);
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [category, setCategory] = useState<teacherCategory>('senior');
	const [Class, setClass] = useState('free');
	const [maxClass, setMaxClass] = useState('.');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		if (creating === 'fulfilled' && !notified.current) {
			notify('success', 'Teacher Successfully Added');
			notified.current = true;
			setSaving(false);
			navigate('/dashboard/teacher/view');
		} else if (creating === 'rejected' && !notified.current) {
			notify('error', createMessage || 'Cannot Add Teacher');
			notified.current = true;
			setSaving(false);
		}
	}, [creating]);

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
	}, [weekdayPeriod, saturdayPeriod]);

	useEffect(() => {
		setTeacherPage(`/dashboard/teacher/add`);
	});

	function onAddHandler() {
		// validating fields
		if (name.replaceAll(' ', '') === '') return notify('error', 'Name cannot be empty');
		if (!['subjunior', 'junior', 'senior', 'pgt'].includes(category)) return notify('error', 'Invalid Category');
		if (!classes.map(c => c.name).includes(Class) && Class !== 'free') return notify('error', 'Invalid class selected');
		if (!classes.map(c => c.name).includes(maxClass) && maxClass !== '.') return notify('error', 'Invalid Max class');
		if (!/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(phone)) return notify('error', 'Invalid phone number');

		setSaving(true);
		notified.current = false;
		createTeacher({ name, category, classTeacherOf: Class, maxTeachingClass: maxClass, timeTable, messagingPreference: 'sms', phone: Number(phone), password });
	}

	const maxP = (saturdayPeriod || 0) > (weekdayPeriod || 0) ? saturdayPeriod || 0 : weekdayPeriod || 0;
	const periodArray: number[] = [];
	for (let i = 1; i <= maxP; i++) {
		periodArray.push(i);
	}

	return (
		<>
			<Container maxWidth='xl' sx={{ mb: 8 }}>
				<Box component='div' sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Box className='left' sx={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
						<IconButton size='large' onClick={() => navigate('/dashboard/teacher/view')}>
							<ArrowBack />
						</IconButton>
						<Typography variant='h4' sx={{ my: 2 }}>
							Add Teacher
						</Typography>
					</Box>
					<Button onClick={onAddHandler} variant='contained' color='success' sx={{ bgcolor: '#00c400', color: 'white', mt: 3, mb: 2 }}>
						{saving ? (
							<Loader height={30} width={30} />
						) : (
							<>
								Add <SaveOutlined sx={{ ml: 1 }} />
							</>
						)}
					</Button>
				</Box>

				<Box className='addTeacher'>
					<Box className='infoGrid' sx={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: 6 }}>
						<TextField label='Name' value={name} onChange={e => setName(e.target.value)} />

						<FormControl sx={{ flex: '1', minWidth: '200px' }}>
							<InputLabel id='demo-simple-select-label'>Category</InputLabel>
							<Select
								value={category}
								labelId='demo-simple-select-label'
								onChange={e => setCategory(e.target.value as teacherCategory)}
								id='demo-simple-select'
								label='Category'
							>
								<MenuItem value='subjunior'>Sub-Junior</MenuItem>
								<MenuItem value='junior'>Junior</MenuItem>
								<MenuItem value='senior'>Senior</MenuItem>
								<MenuItem value='pgt'>PGT</MenuItem>
							</Select>
						</FormControl>

						<FormControl sx={{ flex: '1', minWidth: '200px' }}>
							<InputLabel id='demo-simple-select-label'>Class Teacher of</InputLabel>
							<Select value={Class} onChange={e => setClass(e.target.value as string)} id='demo-simple-select' label='Class Teacher of'>
								<MenuItem value='free'>None</MenuItem>
								{classes.map(c => (
									<MenuItem key={c.name} value={c.name}>
										{c.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<TextField label='Phone' type='number' value={phone} onChange={e => setPhone(e.target.value)} />
						<TextField label='Teacher Password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
						<Box className='maxTeachingClass'>
							<Typography color='primary' sx={{ pb: 2 }}>
								Select The Maximum class upto which teacher can teach
							</Typography>
							<Box sx={{ display: 'flex', gap: '.5em', flexWrap: 'wrap' }} className='classes'>
								{[...classes]
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
												background: c.handlingLevel <= maxCL(classes, maxClass) ? theme.primary : 'grey',
												opacity: c.handlingLevel <= maxCL(classes, maxClass) ? '1' : '.3',
												borderRadius: 2,
											}}
										>
											{c.name}
										</Box>
									))}
							</Box>
						</Box>
					</Box>
					<Typography color='primary' sx={{ mt: 8 }}>
						Fill out the timetable of the Teacher
					</Typography>
					<div className='tableEntry'>
						<TimeTableEntry periods={periodArray} timetable={timeTable as teacherTimetable} setTimetable={setTimeTable} />
					</div>
				</Box>
			</Container>
		</>
	);
}
