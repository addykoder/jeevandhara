import axios from 'axios';
import { DragEvent, useEffect, useState } from 'react';
import { serverURL } from '../../utils/constants';
import useToast from '../../hooks/useToast';
import useReschedules from '../../store/attendance/useReschedules';
import { Button, Typography, useMediaQuery } from '@mui/material';
import { reschedulesDatatype as tempDatatype } from '../../utils/types';
import Styles from './styles';
import { useNavigate } from 'react-router-dom';

interface reschedulesDatatype extends tempDatatype {
	_id: string;
}
export type summaryType = { teacherId: number; teacherName: string; timeTable: { period: string; tags: string[]; rescheduleObj?: reschedulesDatatype }[] };

export default function ModifyReschedules() {

	const notify = useToast();
	const [summary, setSummary] = useState<summaryType[]>([]);
	const [hoverData, setHoverData] = useState<dataType>({ period: '', tags: [] });
	const [, reschedules, , , , , , , , , , , , , , ,] = useReschedules();
	const [forgedReschedules, setForgedReschedules] = useState<reschedulesDatatype[]>([]);
	const [loading, setLoading] = useState(false);

	// useEffect(() => console.table(forgedReschedules), [forgedReschedules]);

	useEffect(() => {
		axios.post(`${serverURL}/reschedule/summary`, { includeSubstitutions: false })
			.then(r => {
				const summary: summaryType[] = r.data.payload;
				// plotting substitutions over the blank summary

				const plottedSummary = summary.map(s => {
					for (const res of reschedules.filter(r => r.teacherId === s.teacherId)) {
						s.timeTable[res.periodNo - 1] = { ...s.timeTable[res.periodNo - 1], tags: ['reschedule'], rescheduleObj: res as reschedulesDatatype, period: res.className };
					}
					return s;
				});
				setSummary(plottedSummary);
			})
			.catch(e => {
				console.log(e);
				notify('error', e.response.data);
			});
	}, [reschedules]);

	function onDragStartHandler(e: DragEvent, data: dataType) {
		setHoverData(data);
	}
	function onDragEndHandler() {
		setHoverData({ period: '', tags: [] });
	}

	function period(p: { period: string; tags: string[]; rescheduleObj?: reschedulesDatatype }) {
		if (p.tags.includes('reschedule')) return <DraggablePeriodBlock onDragStartHandler={onDragStartHandler} onDragEndHandler={onDragEndHandler} data={p} />;
		if (p.period === 'free') return '';
		return p.period.split(':')[0];
	}

	function pStyle(p: { period: string; tags: string[]; rescheduleObj?: reschedulesDatatype }) {
		if (p.tags.includes('reschedule')) return { opacity: 1 };
		return { opacity: 0.6 };
	}

	function onDragOverHandler(p: { period: string; tags: string[]; rescheduleObj?: reschedulesDatatype }, periodNo: number) {
		return p.period === 'free' && hoverData.rescheduleObj?.periodNo === periodNo
			? (e: DragEvent) => {
					e.preventDefault();
					(e as any).target.style.background = '#1976d2';
				}
			: () => undefined;
	}

	function onDropHandler(e: DragEvent | any, to: summaryType, p?: { period: string }, periodNo?: number) {
		// creating the new reschedule object
		if (p && !(p.period === 'free' && hoverData.rescheduleObj?.periodNo === periodNo)) return;

		const newRescheduleObj = {
			...(hoverData.rescheduleObj as reschedulesDatatype),
			teacherId: to.teacherId,
			teacherName: to.teacherName,
			reason: 'manual',
			tags: ['manual'],
			teacherMessagingPreference: '.',
			teacherPhone: 1111111111,
		};

		// updating the summary object to reflect changes
		setSummary(
			summary.map(s => {
				// if got old position of period -> remove the substitution
				if (s.teacherId === hoverData.rescheduleObj?.teacherId) {
					return {
						...s,
						timeTable: s.timeTable.map((p, index) => {
							if (index + 1 === hoverData.rescheduleObj?.periodNo) return { period: 'free', tags: ['regular'] };
							return p;
						}),
					};
				}

				// if got new position of period -> add the substitution
				else if (s.teacherId === to.teacherId) {
					return {
						...s,
						timeTable: s.timeTable.map((p, index) => {
							if (index + 1 === hoverData.rescheduleObj?.periodNo) return { period: hoverData.period, tags: ['reschedule'], rescheduleObj: newRescheduleObj };
							return p;
						}),
					};
				}

				return s;
			})
		);

		// updating the forged reschedules
		if (forgedReschedules.map(r => r._id).includes(newRescheduleObj._id)) {
			setForgedReschedules(forgedReschedules.map(r => (r._id === newRescheduleObj._id ? newRescheduleObj : r)));
		} else {
			setForgedReschedules([...forgedReschedules, newRescheduleObj]);
		}

		// resetting hover state after dropped
		setHoverData({ period: '', tags: [] });
	}

	const navigate = useNavigate();

	async function handleSave() {
		// added a temporary hard coded restriction to modify reschedules
		if (prompt('Enter pass key') !== '112233') return notify('error', 'Access Denied')
		
		
		setLoading(true);


		await axios
			.post(`${serverURL}/reschedule/modify`, { reschedules: forgedReschedules })
			.then(() => {
				navigate('/dashboard/reschedules');
				notify('success', 'Reschedules updated successfully');
				setLoading(false);
			})
			.catch(() => {
				notify('error', 'Some Error occurred');
				setLoading(false);
			});
	}

	const matches1000p = useMediaQuery('(min-width:1000px)');
	const matches600p = useMediaQuery('(min-width:600px)');
	const matches450p = useMediaQuery('(min-width:450px)');
	const matches300p = useMediaQuery('(min-width:300px)');
	

	return (
		<Styles style={{ userSelect: 'none', position: 'relative' }}>
			<Button
				disabled={loading}
				variant='contained'
				sx={{ marginRight: matches450p ? '5em' : '1em', paddingBlock: '.5em', position: 'sticky', top: '8em', boxShadow: '0 0 40px 20px #050f20', float: 'right', zIndex: 1000 }}
				onClick={handleSave}
			>
				Save Changes
			</Button>
			<Typography variant={matches450p ? 'h3' : 'h4'} sx={{ fontWeight: '200' }}>
				Edit Substitutions
			</Typography>
			<Typography sx={{ opacity: 0.8, ml: 1, mb: 8 }}>{'Drag and drop periods to modify substitutions, Or tap and click if you are on a mobile device'}</Typography>
			{/* Custom summary display code here */}

			<div
				className='wrapper'
				style={{width:matches1000p? '1200px' : matches600p? '600px' :`${window.innerWidth - 20}px`, overflow:'scroll', marginInline:'auto'}}
				// style={{ width: matches1000p ? '1200px' : matches600p ? '600px' : matches450p ? '450px' : matches300p ? '300px' : '250px', overflow: 'scroll', marginInline: 'auto' }}
			>
				<table style={{ marginInline: 'auto', width: 'max-content' }}>
					<tbody>
						{summary
							// sorting by name order
							.sort((a, b) => (a.teacherName > b.teacherName ? 1 : -1))
							.map(s => {
								return (
									<tr
										key={JSON.stringify(s)}
										style={{
											overflow: 'hidden',
											fontSize: matches450p ? '1.2rem' : '1rem',
											opacity:
												hoverData.period === ''
													? 1
													: s.timeTable[(hoverData.rescheduleObj?.periodNo as number) - 1].period === 'free' ||
														s.timeTable[(hoverData.rescheduleObj?.periodNo as number) - 1].period === hoverData.period
													? 1
													: 0.3,
										}}
									>
										<td style={{ paddingRight: '1em' }}>{s.teacherName}</td>
										<td style={{ padding: '.25em 0' }}>
											<table style={{ borderCollapse: 'collapse' }}>
												<tbody>
													<tr>
														{s.timeTable.map((p, index) => (
															<td
																className='tableListBlock'
																key={JSON.stringify(s) + index}
																style={{
																	border:
																		hoverData.period === ''
																			? '1px solid rgba(256,256,256,.6)'
																			: (s.timeTable[(hoverData.rescheduleObj?.periodNo as number) - 1].period === 'free' ||
																					s.timeTable[(hoverData.rescheduleObj?.periodNo as number) - 1].period ===
																						hoverData.period) &&
																				index + 1 === hoverData.rescheduleObj?.periodNo
																			? '1px dashed #0b86eb'
																			: '1px solid rgba(256,256,256,.3)',
																	outline:
																		hoverData.period === ''
																			? ''
																			: (s.timeTable[(hoverData.rescheduleObj?.periodNo as number) - 1].period === 'free' ||
																					s.timeTable[(hoverData.rescheduleObj?.periodNo as number) - 1].period ===
																						hoverData.period) &&
																				index + 1 === hoverData.rescheduleObj?.periodNo
																			? '1px dashed #0b86eb'
																			: '',
																	width: matches450p ? '75px' : '40px',
																	fontWeight: 200,
																	padding: '.25em .5em',
																	textAlign: 'center',
																	...pStyle(p),
																}}
																onDragOver={onDragOverHandler(p, index + 1)}
																onDragLeave={e => {
																	if ((e as any).target.classList.contains('tableListBlock')) (e as any).target.style.background = 'transparent';
																}}
																onClick={e => onDropHandler(e, s, p, index + 1)}
																onDrop={e => onDropHandler(e, s)}
															>
																{period(p)}
															</td>
														))}
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</Styles>
	);
}

// function CustomSummaryDisplay({ summary }:{summary: { teacherId: number; teacherName: string; timeTable: { period: string; tags: string[] }[] }[]}) {

// 	return
// }

type dataType = { period: string; tags: string[]; rescheduleObj?: reschedulesDatatype };

function DraggablePeriodBlock({
	data,
	onDragStartHandler,
	onDragEndHandler,
}: {
	data: dataType;
	onDragStartHandler: (e: DragEvent | any, data: dataType) => void;
	onDragEndHandler: (e: DragEvent) => void;
}) {
	return (
		<div
			draggable
			onDragStart={e => onDragStartHandler(e, data)}
			onClick={e => {
				e.preventDefault();
				e.stopPropagation();
				onDragStartHandler(e, data);
			}}
			onDragEnd={onDragEndHandler}
			className='draggablePeriodBlock'
			style={{ backgroundColor: '#0b86eb', borderRadius: '5px', margin: '0 0', fontWeight: 900, padding: '.25em 0' }}
		>
			{data.period}
		</div>
	);
}
