import { Box, Container, Typography, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { teacherPageContext } from '../../App';
import useToast from '../../hooks/useToast';
import { serverURL } from '../../utils/constants';
import { TailSpin } from 'react-loader-spinner';
import Loader from '../../components/loader/Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { Block } from '../account/Account';
import theme from '../../context/theme';
import usePreference from '../../store/preferences/usePreference';
import useTeacher from '../../store/teacher/useTeacher';

export default function SpecificTeacher() {
	const [, setTeacherPage] = useContext(teacherPageContext);
	const { id } = useParams();
	const [teacher, setTeacher] = useState<{ [key: string]: string }>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const notify = useToast();
	const navigate = useNavigate();
	const notified = useRef(true);
	const isSmall = !useMediaQuery('(min-width:900px)');
	const [{ saturdayPeriod, weekdayPeriod }] = usePreference();

	const [, , , deleteTeacher, , , , deleting, , , , deleteMessage] = useTeacher();

	useEffect(() => {
		if (deleting === 'fulfilled') {
			notify('success', 'Teacher Deleted Successfully');
			notified.current = true;
			navigate('/dashboard/teacher/view');
		} else if (deleting === 'rejected') {
			notify('error', deleteMessage || 'Cannot delete Teacher');
			notified.current = true;
		}
	}, [deleting]);

	useEffect(() => {
		setLoading(true);
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
		setTeacherPage(`/dashboard/teacher/view/${id}`);
	});

	function deleteHandler() {
		if (!confirm('Are you sure You want to PERMANENTLY DELETE the teacher')) return;
		deleteTeacher(Number(id));
		notified.current = false;
	}

	const maxP = (saturdayPeriod || 0) > (weekdayPeriod || 0) ? saturdayPeriod || 0 : weekdayPeriod || 0;
	const periodArray: number[] = [];
	for (let i = 1; i <= maxP; i++) {
		periodArray.push(i);
	}

	if (loading) return <Loader />;
	if (error) return <Typography color='error'>Cannot fetch Teachers</Typography>;
	if (!teacher) return <Loader />;

	const phone = '* '.repeat(String(teacher.phone).length - 3) + String(teacher.phone).slice(String(teacher.phone).length - 3, String(teacher.phone).length);

	return (
		<>
			<Container className='teacher' maxWidth='xl' sx={{ mb: 8 }}>
				<Box className='header' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
					<Box className='left' sx={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
						<IconButton size='large' onClick={() => navigate('/dashboard/teacher/view')}>
							<ArrowBackIcon />
						</IconButton>
						<Typography variant='h4' sx={{ my: 2 }}>
							{teacher.name}
						</Typography>
					</Box>
					<Box className='actions' sx={{ display: 'flex', alignItems: 'center' }}>
						<IconButton onClick={() => navigate(`/dashboard/teacher/update/${id}`)} size='large'>
							<EditIcon />
						</IconButton>
						<IconButton onClick={deleteHandler} size='large'>
							{deleting === 'pending' ? <TailSpin color='white' width={30} height={30} /> : <DeleteIcon color='error' />}
						</IconButton>
					</Box>
				</Box>

				<Box className='infoGrid' sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
					<Block data={teacher.id as string} label='ID' />
					<Block data={teacher.classTeacherOf === 'free' ? 'None' : (teacher.classTeacherOf as string)} label='Class Teacher Of' />
					<Block data={teacher.category as string} label='Category' />
					<Block data={teacher.maxTeachingClass === '.' ? 'No Limit' : (teacher.maxTeachingClass as string)} label='Class Handling Limit' />
					<Block data={teacher.messagingPreference === 'none' ? 'None' : (teacher.messagingPreference as string)} label='Messaging Preference' />
					<Block data={teacher.phone === undefined ? 'Not Available' : phone} label='Phone' />

					<Box sx={{ gridColumn: '1/3', p: 1, mx: isSmall ? 0 : 1, borderRadius: 2 }} className='infoPiece'>
						<Typography color='primary' variant='h6' sx={{ fontSize: '1rem', fontWeight: 400 }}>
							Classes Teaching :
						</Typography>
						{teacher.classesTeaching.length === 0 ? (
							<Typography sx={{ opacity: '.5' }}>None</Typography>
						) : (
							<Box sx={{ display: 'flex', gap: '.5em', flexWrap: 'wrap' }} className='classes'>
								{(teacher.classesTeaching as unknown as string[]).map(c => (
									<Box key={c} sx={{ py: '.5em', px: '1em', background: theme.primary, borderRadius: 2 }}>
										{c}
									</Box>
								))}
							</Box>
						)}
					</Box>
				</Box>
				<Typography color='primary' variant='h5' sx={{ mt: 4, mb: 2 }}>
					Time Table
				</Typography>
				<div className='timeTable specificTeacher'>
					<table>
						<thead>
							<tr>
								<th>Day</th>
								{periodArray.map(p => (
									<th style={{ paddingInline: '2.5em!important' }} key={p}>
										{p}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(day => {
								return (
									<tr key={day}>
										<>
											<td>{day}</td>
											{periodArray.map(p => {
												const period = p - 1;
												const timetable = teacher.timeTable as unknown as { [key: string]: string[] };
												return (
													<td
														key={period}
														style={{
															color: timetable[day][period] === 'free' || timetable[day][period] === 'busy' ? 'grey' : 'white',
															fontWeight: timetable[day][period] === 'free' || timetable[day][period] === 'busy' ? '200' : '400',
															textTransform: !['free', 'busy'].includes(timetable[day][period]) ? 'uppercase' : 'none',
														}}
													>
														{timetable[day][period] === 'free' ? '- -' : timetable[day][period] === 'busy' ? 'busy' : timetable[day][period]}
													</td>
												);
											})}
										</>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</Container>
		</>
	);
}
