import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, Slider, Typography, useMediaQuery } from '@mui/material';
import ChangeIcon from '@mui/icons-material/ChangeCircleOutlined';
import { Suspense, useEffect, useState } from 'react';
import useToast from '../../hooks/useToast';
import useReschedules from '../../store/attendance/useReschedules';
import ReschedulesDisplay from './ReschedulesDisplay';
import Loader from '../../components/loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { attPrefDatatype, reschedulesDatatype } from '../../utils/types';
import { serverURL } from '../../utils/constants';
import axios from 'axios';
import useAccountInfo from '../../store/account/useAccountInfo';
import Styles from './styles';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import { PreferenceDisplay } from '../takeAttendance/TakeAttendance';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';					

export default function ViewReschedules({ publicPage }: { publicPage?: boolean }) {
	const [, reschedules, , , , , , , , , , , , dayN, , , regenerate] = useReschedules();

	const [{ username }] = useAccountInfo();

	const [fetchedReschedules, setFetchedReschedules] = useState<reschedulesDatatype[]>([]);
	const [day, setDay] = useState(new Date().getDay());
	const [preferences, setPreferences] = useState({});
	const [summary, setSummary] = useState([]);
	// const notified = useRef(true);
	const params = useParams();
	const navigate = useNavigate();
	const [signCol, setSignCol] = useState(publicPage);
	const [hidePreserved, setHidePreserved] = useState(false);
	const [showPreferences, setShowPreferences] = useState(false);
	const [toggleToRefetch, setToggleToRefetch] = useState(false);


	useEffect(() => {
		if (publicPage) {
			localStorage.setItem('index-page', `/reschedules/${params.username}`);
			axios.get(`${serverURL}/reschedule/${params.username}`)
				.then(r => {
					if (r.data.status === 'ok') {
						setFetchedReschedules(r.data.payload.reschedules);
						setDay(r.data.payload.day);
						setPreferences(r.data.payload.preferences);
						setSummary(r.data.payload.summary)
					} else {
						notify('error', r.data.message || 'Invalid school username provided as input');
						localStorage.setItem('index-page', '/reschedules');
						// to fix a bug
						localStorage.removeItem('username');
						navigate('/reschedules');
					}
				})
				.catch(e => {
					console.log(e);
					notify('error', e.response.data);
				});
		}
		else {
			axios.post(`${serverURL}/reschedule/summary`).then(r => {
				setSummary(r.data.payload.filter((a:{timeTable:{tags:string[]}[]}) =>{
					return a.timeTable.map(p => p.tags.join(' ')).join(' ').includes('reschedule');
				}
				))
			})
				.catch(e => {
					console.log(e);
					notify('error', e.response.data);
				});
		}
	}, [toggleToRefetch]);

	const isMobile = !useMediaQuery('(min-width:600px)');
	const notify = useToast();
	// const [confirming, setConfirming] = useState(false);
	const [grouping, setGrouping] = useState<'period' | 'class' | 'assignedTeacher' | 'absentTeacher'>('assignedTeacher');

	async function RegenerateReschedules() {
		if (!confirm('Confirm regenerate substitutions?')) return;
		// here regenerated with new day but to regenerate with already give day
		// submitAttendance(attendance as attendanceDatatype[], dayN, preserve, preserveTill);
		regenerate()

		setTimeout(()=>setToggleToRefetch(!toggleToRefetch),500)
		

	}

	// function confirmHandler() {
	// 	return notify('info', 'Feature not available, contact developer');
	// 	setConfirming(true);
	// 	notified.current = false;
	// 	confirmReschedules();
	// }

	// useEffect(() => {
	// 	if (confirmingReschedules === 'fulfilled' && !notified.current) {
	// 		notify('success', 'Notified Teachers successfully');
	// 		setConfirming(false);
	// 	} else if (confirmingReschedules === 'rejected' && !notified.current) {
	// 		notify('error', confirmMessage || 'Cannot Notify');
	// 		setConfirming(false);
	// 	}
	// }, [confirmingReschedules]);

	const matchesPrint = useMediaQuery('print');

	// finding min and max period numbers
	let min = (publicPage?fetchedReschedules:reschedules)[0]?.periodNo || 0;
	let max = (publicPage?fetchedReschedules:reschedules)[0]?.periodNo || 0;

	for (const resc of publicPage?fetchedReschedules:reschedules) {
		if (resc.periodNo > max) max = resc.periodNo;
		else if (resc.periodNo < min) min = resc.periodNo;
	}

	const [periodRange, setPeriodRange] = useState<[number, number]>([min, max]);
	// updating min, max range when fetched reschedules
	useEffect(() => {
		setPeriodRange([min, max]);
	}, [reschedules, fetchedReschedules]);

	const matches450p = useMediaQuery('(min-width:450px)');

	return (
		<>
			<Styles>
				<Suspense fallback={<Loader />}>
					<div className='wrapper' style={{ display: 'flex', flexDirection: 'column', minHeight: '90vh', justifyContent: 'space-between' }}>
						<Container maxWidth='xl' sx={{ mt: 2, mb: 8 }}>
							<Box
								className='reschedulesHeader'
								sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, justifyContent: 'space-between', marginBottom: matchesPrint ? '2em' : '' }}
							>
								<Box className='left' sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
									<Typography component='h1' variant='h3'>
										Government Helpline
									</Typography>
									{/* will not show up on printed page */}
									{/* {matchesPrint || (
										<Button
											variant='outlined'
											onClick={() => {
												navigator.clipboard.writeText(window.location.origin + `/#/reschedules/${username}`);
												notify('info', `URL copied to clipboard, share with teachers to easily view reschedules`);
											}}
										>
											Copy Public URL
										</Button>
									)} */}
								</Box>
								<Typography variant='h4' sx={{ flex: 1, textAlign: 'right', fontWeight: 100, opacity: 0.8 }}>
									<div style={{ opacity: 0.5 }}>
										{new Date().getDate()} {new Date().toLocaleString('default', { month: 'long' }).toLowerCase()}, {new Date().getFullYear()}
									</div>
									
								</Typography>
							</Box>

							{(publicPage && showPreferences) ? (
								<div className='onPrint' style={{ paddingInline: '4rem', paddingLeft: '6rem' }}>
									<PreferenceDisplay showDay={false} day={day} preferences={preferences as attPrefDatatype} />
								</div>
							) : (
								''
							)}


							<Box
								className='hideOnPrint'
								component='div'
								sx={{
									mt: 6,
									mb: 4,
									display: matchesPrint ? 'none' : 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									gap: '2em',
									flexWrap: 'wrap',
									padding: '2rem 4rem',
									backgroundColor: 'rgba(100,100,100,.1)',
									borderRadius: '10px',
									// backgroundColor: 'white',
								}}
							>
								<div style={{ display: 'flex', gap: '2em', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
									<FormControl sx={{ flex: isMobile ? 1 : undefined }}>
										<InputLabel id='demo-simple-select-label'>Select Your State</InputLabel>
										<Select
										style={{ minWidth: '150px' }}
											value={grouping}
											labelId='demo-simple-select-label'
											onChange={e => setGrouping(e.target.value as 'period' | 'class' | 'assignedTeacher' | 'absentTeacher')}
											id='demo-simple-select'
											label='Category'
										>
											<MenuItem value='Select State'>Select State</MenuItem>
								<MenuItem value='Andaman and Nicobar Islands'>Andaman and Nicobar Islands</MenuItem>
								<MenuItem value='Andhra Pradesh'>Andhra Pradesh</MenuItem>
								<MenuItem value='Assam'>Assam</MenuItem>
								<MenuItem value='Bihar'>Bihar</MenuItem>
								<MenuItem value='Chandigarh'>Chandigarh</MenuItem>
								<MenuItem value='Chattisgarh'>Chattisgarh</MenuItem>
								<MenuItem value='Dadar and Nagar Haweli'>Dadar and Nagar Haweli</MenuItem>
								<MenuItem value='Daman and Diu'>Daman and Diu</MenuItem>
								<MenuItem value='Delhi'>Delhi</MenuItem>
								<MenuItem value='Goa'>Goa</MenuItem>
								<MenuItem value='Gujrat'>Gujrat</MenuItem>
								<MenuItem value='Haryana'>Haryana</MenuItem>
								<MenuItem value='Himachal Pradesh'>Himachal Pradesh</MenuItem>
								<MenuItem value='Jammu and Kashmir'>Jammu and Kashmir</MenuItem>
								<MenuItem value='Jharkhand'>Jharkhand</MenuItem>
								<MenuItem value='Karnatak'>Karnatak</MenuItem>
								<MenuItem value='Kerala'>Kerala</MenuItem>
								<MenuItem value='Ladakh'>Ladakh</MenuItem>
								<MenuItem value='Lakshadweep'>Lakshadweep</MenuItem>
								<MenuItem value='Madhya Pradesh'>Madhya Pradesh</MenuItem>
								<MenuItem value='Maharashtra'>Maharashtra</MenuItem>
								<MenuItem value='Manipur'>Manipur</MenuItem>
								<MenuItem value='Meghalaya'>Meghalaya</MenuItem>
								<MenuItem value='Mizoram'>Mizoram</MenuItem>
								<MenuItem value='Nagaland'>Nagaland</MenuItem>
								<MenuItem value='Odisha'>Odisha</MenuItem>
								<MenuItem value='Pudducherry'>Pudducherry</MenuItem>
								<MenuItem value='Punjab'>Punjab</MenuItem>
								<MenuItem value='Rajasthan'>Rajasthan</MenuItem>
								<MenuItem value='Sikkhim'>Sikkhim</MenuItem>
								<MenuItem value='Tamil Nadu'>Tamil Nadu</MenuItem>
								<MenuItem value='Telangana'>Telangana</MenuItem>
								<MenuItem value='Tripura'>Tripura</MenuItem>
								<MenuItem value='Uttar Pradesh'>Uttar Pradesh</MenuItem>
								<MenuItem value='Uttarakhand'>Uttarakhand</MenuItem>
								<MenuItem value='West Bengal'>West Bengal</MenuItem>

										</Select>
									</FormControl>
									{publicPage ? (
										<>
											<FormControlLabel
												label={
													<Typography fontSize='1.2rem' fontWeight={200}>
														Sign. Column
													</Typography>
												}
												control={<Checkbox onChange={e => setSignCol(e.target.checked)} checked={signCol} sx={{ scale: '1.4', mr: 0.5 }} />}
											/>
											<FormControlLabel
												label={
													<Typography fontSize='1.2rem' fontWeight={200}>
														Print Preferences
													</Typography>
												}
												control={<Checkbox onChange={e => setShowPreferences(e.target.checked)} checked={showPreferences} sx={{ scale: '1.4', mr: 0.5 }} />}
											/>
											<FormControlLabel
												label={
													<Typography fontSize='1.2rem' fontWeight={200}>
														Hide Preserved Periods
													</Typography>
												}
												control={<Checkbox onChange={e => setHidePreserved(e.target.checked)} checked={hidePreserved} sx={{ scale: '1.4', mr: 0.5 }} />}
											/>
											<div style={{ width: '100%' }}>
												<Typography id='input-slider' gutterBottom>
													Select Periods to Display
												</Typography>
												<Slider
													getAriaLabel={() => 'Minimum distance'}
													value={periodRange}
													onChange={e =>
														// (e?.target as unknown as { value: [number] })?.value[0] ===
														// (e?.target as unknown as { value: [number, number] }).value[1]
														// 	? () => undefined:
														setPeriodRange((e?.target as unknown as { value: [number, number] }).value)
													}
													marks
													valueLabelDisplay='auto'
													min={min}
													max={max}
												/>
											</div>
										</>
									) : (
										''
									)}
								</div>

								<IconButton
									onClick={() => {
										publicPage ? setTimeout(() => window.print(), 100) : navigate(`/reschedules/${username}`);
									}}
									color='primary'
									size='large'
								>
								</IconButton>


							</Box>

							<h2>Nagaland</h2>
							<h4>Phone Number</h4>
							<p>1800-202-3380</p>
							<h4>Email</h4>
							<p>support-nhps@cmhis.nagaland.gov.in</p>

							<hr />

							<h2>Sikkim</h2>
							<h4>Phone Number</h4>
							<p>9436152356</p>
							<h4>Email</h4>
							<p>shamizoram@gmail.com</p>

							<hr />
							<h2>Mizoram</h2>
							<h4>Phone Number</h4>
							<p>03592-202633</p>
							<h4>Email</h4>
							<p>secretary-health@sikkim.gov.in</p>

							<hr />
							<h2>Arunachal Pradesh</h2>
							<h4>Phone Number</h4>
							<p>0360 2244248</p>
							<h4>Email</h4>
							<p>dhsnlg@gmail.com</p>

							<hr />
							<h2>Meghalaya</h2>
							<h4>Phone Number</h4>
							<p>0364-2500019</p>
							<h4>Email</h4>
							<p>sampath97@gmail.com</p>

							<hr />
							<h2>Tripura</h2>
							<h4>Phone Number</h4>
							<p>+91-381-2415058</p>
							<h4>Email</h4>
							<p>healthfinancep@gmail.com</p>


							{/* <Typography  color='primary' style={{margin: '.5em 0 2em 1em', fontSize:'1.2rem' }}> <span style={{color:'white'}}>{reschedules.filter(r => r.tags?.includes('preserved')).length}</span> Periods are preserved</Typography> */}
							<SummaryDisplay summary={summary} />


							

							{/* hid messages notify button */}
							{/* {reschedules.length !== 0 && !publicPage ? (
								<Button onClick={confirmHandler} variant='outlined' fullWidth sx={{ py: 2 }}>
									{confirming ? <Loader width={30} height={30} /> : 'Confirm Reschedules and Notify'}
								</Button>
							) : (
								''
							)} */}
						</Container>
						{publicPage ? (
							<>
								<div className='watermark w1'>
									<h1>JEEVANDHARA</h1>
								</div>
								<div className='watermark w2'>ADITYATRIPATHI.COM</div>
								<div className='adityaTripathi'>
									<div>
										Developed and Maintained by{' '}
										<a className='mylink' href='https://adityatripathi.com'>
											Aditya Tripathi
										</a>
									</div>
									<div className='appLink'>
										<span>Jeevandhara</span> @ <a className='link'>jeevandhara1.vercel.app</a>
									</div>

									{/* <div className='websiteLink'>
										<a className='link'>AdityaTripathi.com</a>
									</div> */}
								</div>
							</>
						) : (
							''
						)}
					</div>
				</Suspense>
			</Styles>
		</>
	);
}

export function SummaryDisplay({ summary}: { summary: { teacherId: number; teacherName: string; timeTable: { period: string; tags: string[] }[] }[]}) {
	
	return (
		<Styles>
		<div className='summary' style={{margin:'4em 0', marginInline:'auto', width:'max-content', marginBottom:'6em', padding:'2em', borderRadius:'15px'}}>

				{
					summary.length > 0 &&
					
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2em' }}>
						<Typography variant='h4' sx={{ fontWeight: 100, opacity: 0.5, textAlign: 'center' }}>Summary</Typography>
						{/* {allowEditRedirect ?  */}
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1em' }}>
							<div className="auto blackOutline" style={{ padding: '.25em .5em', fontWeight: '900', outline: '2px solid #1976d2' }}>Automatic</div>
							<div className="manual blackDotted" style={{ padding: '.25em .5em', outline: '2px solid #d64400', fontWeight: '900' }}>Manual</div>
						</div>
					</div>
				}
		<table style={{ fontSize: '1.2rem' }}>
			{summary.sort((s1,s2) => s1.teacherName>s2.teacherName?1:-1).map(s => (
				<tr>
					<td className='name' style={{ textAlign: 'left', padding: '.25em .5em' }}>
						{s.teacherName}
					</td>
					<td style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid grey', margin: '.25em 0em .25em 1em' }}>
						{s.timeTable.map(t => (

							<div className={ `timetableBlock ${t.tags.includes('manual')?'blackDotted':t.tags.includes('reschedule')?'blackOutline':''}`  }style={{ width: '45px', padding:'.25em .5em', fontSize: '1rem', textAlign:'center', ...(t.tags.includes('manual')?{fontWeight:'900', outline:'2px solid #d64400'}: t.tags.includes('reschedule')?{outline:'2px solid #1976d2', fontWeight:900}:{fontWeight:'400', opacity:'.5!important'}) }}>{t.period === 'free'? '':t.period.split(':')[0]}</div>
						))}
					</td>
				</tr>
			))}
		</table>
</div></Styles>
	);
}