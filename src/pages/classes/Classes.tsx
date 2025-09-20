import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Loader from '../../components/loader/Loader';
import { useEffect, useRef, useState } from 'react';
import useClasses from '../../store/classes/useClasses';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { classesObjectType } from '../../utils/types';
import useToast from '../../hooks/useToast';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import axios from 'axios';
import { serverURL } from '../../utils/constants';

export default function Classes() {
	const [data, updateClasses, , updating, updateMessage] = useClasses();
	const [addActive, setAddActive] = useState(false);
	const [renameActive, setRenameActive] = useState(false);
	const [isModified, setIsModified] = useState(false);
	const [saving, setSaving] = useState(false);

	const [classes, setClasses] = useState<classesObjectType[]>(data as unknown as classesObjectType[]);
	useEffect(() => setClasses(data as unknown as classesObjectType[]), [data]);

	const notified = useRef(true);
	const notify = useToast();

	const [name, setName] = useState('');
	const [level, setLevel] = useState(0);
	const [category, setCategory] = useState('senior');
	const [prevName, setPrevName] = useState('');
	const [newName, setNewName] = useState('');

	const isBig = useMediaQuery('(min-width:1660px)');
	const isMedium = useMediaQuery('(min-width:1300px)');
	const isS1 = useMediaQuery('(min-width:900px)');
	const isS2 = useMediaQuery('(min-width:750px)');
	const isS3 = useMediaQuery('(min-width:600px)');
	const isS4 = useMediaQuery('(min-width:450px)');

	function onSaveHandler() {
		if (!confirm(' !! Changing the information of classes may result in unexpected functioning of the app. CONTINUE?')) {
			setClasses(data);
			setIsModified(false);
			return;
		}
		setSaving(true);
		updateClasses(classes);
		notified.current = false;
	}

	function addClassHandler() {
		if (name === '') return notify('error', 'Class name not valid');
		if (level > 50 || level < 0) return notify('error', 'Handling level range exceeded');
		if (!['junior', 'senior', 'pgt', 'subjunior'].includes(category)) return notify('error', 'Invalid class category');
		if (classes.map(c => c.name).includes(name)) return notify('error', 'Class already exists')

		updateClasses([...classes, { name, category, handlingLevel: level, _id: undefined as unknown as string }]);
		setSaving(true);
		notified.current = false;
	}

	async function renameClassHandler() {
		const resp = await axios.post(`${serverURL}/classes/rename`, { prevName, newName }).catch(() => {
			notify('error', 'Some error occurred');
		})
		console.log(resp);
		
		if (resp?.data?.status === 'ok') {
			notify('success', 'Successfully renamed, REFRESH');
			setNewName('')
			setPrevName('')
		}
	}

	useEffect(() => {
		if (notified.current) return;
		if (updating === 'fulfilled') {
			notify('success', 'Classes Saved Successfully');
			setName('')
			setLevel(0)
			setSaving(false);
			setIsModified(false);
			notified.current = true;
		} else if (updating === 'rejected') {
			notify('error', updateMessage || 'Cannot save classes');
			setSaving(false);
			notified.current = true;
		}
	}, [updating]);

	const cWidth = isBig ? 400 : isMedium ? 300 : isS1 ? 220 : isS2 ? 180 : isS3 ? 130 : isS4 ? 100 : 60;
	// data grid stuff
	const columns: GridColDef[] = [
		{ field: 'name', headerName: 'Name', flex: 1, editable: false },
		{ field: 'category', filterable: isMedium, headerName: 'Category', type: 'singleSelect', valueOptions: ['subjunior', 'junior', 'senior', 'pgt'], flex: 1, editable: true, sortable: false },
		{ field: 'handlingLevel', filterable: isMedium, headerName: 'Handling Level', width: cWidth, type: 'number', editable: true, align: 'left', headerAlign: 'left' },
		{
			filterable: false,
			field: '_id',
			sortable: false,
			align: 'center',
			headerAlign: 'center',
			headerName: 'Delete',
			width: cWidth / 4,
			renderCell: arg => {
				return (
					<Button
						color='error'
						onClick={() => {
							if (!confirm('Do you really want to delete this class, This may break the application')) return;

							setClasses(classes.filter(c => c._id !== arg.row._id));
							setIsModified(true);
						}}
					>
						<DeleteOutlineOutlined />
					</Button>
				);
			},
		},
	];

	function processRowUpdate(modified: classesObjectType, old: classesObjectType) {
		// saving modified row to state
		notified.current = false;

		setClasses(
			classes.map(c => {
				if (c._id === old._id) {
					return modified;
				}
				return c;
			})
		);

		setIsModified(true);
		return modified;
	}
	return (
		<>
			<Container maxWidth='xl' sx={{ mt: 0, mb: isBig ? 18 : 8 }}>
				<Box component='div' sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Typography component='h1' variant='h3'>
						Classes
					</Typography>

					<Button onClick={onSaveHandler} variant='contained' color='success' disabled={!isModified} sx={{ bgcolor: '#00c400', color: 'white', mt: 3, mb: 2 }}>
						{saving ? (
							<Loader height={30} width={30}  />
						) : (
							<>
								Save <SaveOutlinedIcon sx={{ ml: 1 }} />
							</>
						)}
					</Button>
				</Box>

				{addActive ? (
					<>
						<Typography variant='h5' sx={{ opacity: '.6' }}>
							Add Class
						</Typography>
						<Box className='addClass' sx={{ mb: 8, mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
							<TextField value={name} onChange={e => setName(e.target.value)} type='text' label='Class Name' sx={{ flex: '1', minWidth: '200px' }} />
							<TextField
								value={level}
								onChange={e => setLevel(Number(e.target.value))}
								InputProps={{
									inputProps: {
										max: 50,
										min: 0,
									},
								}}
								type='number'
								label='handlingLevel (1-50)'
								sx={{ flex: '1', minWidth: '200px' }}
							/>
							<FormControl sx={{ flex: '1', minWidth: '200px' }}>
								<InputLabel id='demo-simple-select-label'>Category</InputLabel>
								<Select
									value={category}
									labelId='demo-simple-select-label'
									onChange={e => setCategory(e.target.value as string)}
									id='demo-simple-select'
									label='Category'
								>
									<MenuItem value='subjunior'>Sub-Junior</MenuItem>
									<MenuItem value='junior'>Junior</MenuItem>
									<MenuItem value='senior'>Senior</MenuItem>
									<MenuItem value='pgt'>PGT</MenuItem>
								</Select>
							</FormControl>
							<Button variant='contained' sx={{ flex: '1', minWidth: '200px' }} onClick={addClassHandler}>
								Add Class
							</Button>
						</Box>
					</>
				) : (
					<Button fullWidth variant='outlined' sx={{ my: 6, py: 2 }} onClick={() => setAddActive(true)}>
						Add Class
					</Button>
				)}

				{renameActive ? (
					<>
						<Typography variant='h5' sx={{ opacity: '.6' }}>
							Rename Class
						</Typography>
						<Box className='addClass' sx={{ mb: 8, mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
							<TextField value={prevName} onChange={e => setPrevName(e.target.value)} type='text' label='Old Name' sx={{ flex: '1', minWidth: '200px' }} />
							<TextField value={newName} onChange={e => setNewName(e.target.value)} label='New Name' sx={{ flex: '1', minWidth: '200px' }}/>

							<Button variant='contained' sx={{ flex: '1', minWidth: '200px' }} onClick={renameClassHandler}>
								Rename Class
							</Button>
						</Box>
					</>
				) : (
					<Button fullWidth variant='outlined' sx={{ my: 6, py: 2 }} onClick={() => setRenameActive(true)}>
						Rename Class
					</Button>
				)}






				<DataGrid
					slots={isMedium ? { toolbar: GridToolbar } : {}}
					slotProps={
						isMedium
							? {
									toolbar: {
										showQuickFilter: true,
										quickFilterProps: { debounceMs: 500 },
									},
							}
							: {}
					}
					// disableColumnFilter
					// disableColumnSelector
					hideFooter={!isMedium}
					processRowUpdate={processRowUpdate}
					autoHeight
					rows={classes as unknown as classesObjectType[]}
					columns={columns}
					getRowId={row => row._id as string}
				/>
			</Container>
		</>
	);
}
