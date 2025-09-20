import { Box, Button, Container, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { teacherPageContext } from '../../App';
import useTeacher from '../../store/teacher/useTeacher';
import { classesObjectType, teacherCategory, teacherTimetable, verifyTeacherDatatype } from '../../utils/types';
import Loader from '../../components/loader/Loader';
import { ArrowBack, SaveOutlined } from '@mui/icons-material';
import useClasses from '../../store/classes/useClasses';
import theme from '../../context/theme';
import TimeTableEntry from '../../components/timetableEntry/TimeTableEntry';
import usePreference from '../../store/preferences/usePreference';
import { useNavigate, useParams } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import { Block } from '../account/Account';

function createArr(n: number) {
	const a = [];
	for (let i = 0; i < n; i++) a.push('free');
	return a;
}

function maxCL(classes: classesObjectType[], name: string) {
	if (name === '.') return Infinity;
	for (const c of classes) {
		if (c.name === name) return c.handlingLevel;
	}
	return -Infinity;
}

export default function UpdateTeacher() {
	const [{ saturdayPeriod, weekdayPeriod }] = usePreference();
	const isSmall = !useMediaQuery('(min-width:900px)');
	const [classes] = useClasses();
	const notify = useToast()
	const notified = useRef(true)
	const { id } = useParams()
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [teacher, setTeacher] = useState<verifyTeacherDatatype>();

	const [, setTeacherPage] = useContext(teacherPageContext);
	const [, updateTeacher, , , , updating, , , , updateMessage, , ] = useTeacher()

	const [saving, setSaving] = useState(false);
	const navigate = useNavigate()

	const [name, setName] = useState('');
	const [category, setCategory] = useState<teacherCategory>('senior');
	const [Class, setClass] = useState('free');
	const [maxClass, setMaxClass] = useState('.');
	const [phone, setPhone] = useState('');
	

	useEffect(() => { setLoading(true);
		axios.get(`${serverURL}/teacher/${id}`).then(resp => {
			if (resp.data.status === 'ok') {
				setTeacher(resp.data.payload.teacher);
				setLoading(false);
			} else {
				notify('error', resp.data.message || 'Cannot fetch Teacher data');
				setLoading(false);
				setError(true);
			}
		});
	}, []);

	useEffect(() => {
		if (!teacher) return
		setName(teacher.name)
		setCategory(teacher.category)
		setClass(teacher.classTeacherOf)
		setMaxClass(teacher.maxTeachingClass)
		setTimeTable(teacher.timeTable)
		setPhone(String(teacher.phone))
	}, [teacher])
	
	
	useEffect(() => {
		if (updating === 'fulfilled' && !notified.current) {
			notify('success', 'Teacher Successfully Updated')
			notified.current = true
			setSaving(false)
			navigate('/dashboard/teacher/view')
		}
		else if (updating === 'rejected' && !notified.current) {
			notify('error', updateMessage || 'Cannot Update Teacher')
			notified.current = true
			setSaving(false)
		}
	},[updating])
	
	
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
		sat: createArr(saturdayPeriod as number)
	})
	}
		, [weekdayPeriod, saturdayPeriod])

	useEffect(() => {
		setTeacherPage(`/dashboard/teacher/update/${id}`);
	});

	function onUpdateHandler() {
		// validating fields
		if (name.replaceAll(' ', '') === '') return notify('error', 'Name cannot be empty')
		if (!['subjunior', 'junior', 'senior', 'pgt'].includes(category)) return notify('error', 'Invalid Category')	
		if (!classes.map(c => c.name).includes(Class) && Class!=='free') return notify('error', 'Invalid class selected')
		if (!classes.map(c => c.name).includes(maxClass) && maxClass !== '.') return notify('error', 'Invalid Max class')
		if (!/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(phone)) return notify('error', 'Invalid phone number')

		setSaving(true)
		notified.current = false
		updateTeacher(Number(id), {
			name, category, classTeacherOf: Class, maxTeachingClass: maxClass, timeTable: {
				mon: timeTable.mon,
				tue: timeTable.tue,
				wed: timeTable.wed,
				thu: timeTable.thu,
				fri: timeTable.fri,
				sat: timeTable.sat
		}, messagingPreference:'sms', phone:Number(phone) })
	}

	const maxP = (saturdayPeriod || 0) > (weekdayPeriod || 0) ? (saturdayPeriod || 0) : (weekdayPeriod || 0);
	const periodArray: number[] = [];
	for (let i = 1; i <= maxP; i++) {
		periodArray.push(i);
	}

	if (loading) return <Loader />;
	if (error) return <Typography color='error'>Cannot fetch Teachers</Typography>;
	if (!teacher) return <Loader />

	const phoneN = '* '.repeat(String(teacher.phone).length - 3) + String(teacher.phone).slice(String(teacher.phone).length - 3, String(teacher.phone).length);
	
	return (
		<>
			<Container maxWidth='xl' sx={{mb:8}}>
				<Box component='div' sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Box className='left' sx={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
						<IconButton size='large' onClick={() => navigate('/dashboard/teacher/view')}>
							<ArrowBack />
						</IconButton>
						<Typography variant='h4' sx={{ my: 2 }}>
							Update Teacher
						</Typography>
					</Box>
					<Button onClick={onUpdateHandler} variant='contained' color='success' sx={{ bgcolor: '#00c400', color: 'white', mt: 3, mb: 2 }}>
						{saving ? (
							<Loader height={30} width={30} />
						) : (
							<>
								Update <SaveOutlined sx={{ ml: 1 }} />
							</>
						)}
					</Button>
				</Box>

				<Box className='updateTeacher'>
					<Box className='infoGrid' sx={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: 6 }}>
						<TextField label='Name' value={name} onChange={e => setName(e.target.value)} />

						<FormControl sx={{ flex: '1', minWidth: '200px' }}>
							<InputLabel id='demo-simple-select-label'>Category</InputLabel>
							<Select value={category} labelId='demo-simple-select-label' onChange={e => setCategory(e.target.value as teacherCategory)} id='demo-simple-select' label='Category'>
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

						{/* hid phone update field */}
						{/* <TextField label='Phone' type='number' value={phone} onChange={e => setPhone(e.target.value)} /> */}
					<Block data={String(phoneN)} label='Phone' />

						<Box className='maxTeachingClass'>
							<Typography color='primary' sx={{ pb: 2 }}>
								Select The Maximum class upto which teacher can teach
							</Typography>
							<Box sx={{ display: 'flex', gap: '.5em', flexWrap: 'wrap' }} className='classes'>
								{classes.map(c => (
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
