import { Button, Container, Typography, useMediaQuery } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherPageContext } from '../../App';
import useClasses from '../../store/classes/useClasses';
import useTeacher from '../../store/teacher/useTeacher';

export default function AllTeachers() {
	const [, setTeacherPage] = useContext(teacherPageContext);
	useEffect(() => {
		setTeacherPage(`/dashboard/teacher/view`);
	}, []);

	const [data] = useTeacher();
	const [classes] = useClasses();

	const navigate = useNavigate();

	const isBig = useMediaQuery('(min-width:1660px)');
	const isMedium = useMediaQuery('(min-width:1300px)');
	const isS1 = useMediaQuery('(min-width:900px)');
	const isS2 = useMediaQuery('(min-width:750px)');
	const isS3 = useMediaQuery('(min-width:600px)');
	const isS4 = useMediaQuery('(min-width:450px)');

	const cWidth = isBig ? 400 : isMedium ? 300 : isS1 ? 220 : isS2 ? 180 : isS3 ? 130 : isS4 ? 100 : 60;

	const columns: GridColDef[] = useMemo(
		() =>
			isS2
				? // for big devices
				  [
						{ field: 'name', headerName: 'Name', width: cWidth },
						{ field: 'location', filterable: isMedium, sortable: false, headerName: 'Location', width: cWidth },
						{ field: 'temperature', filterable: isMedium, sortable: false, headerName: 'Temperature', width: cWidth },
						{ field: 'oxygen', filterable: isMedium, sortable: false, headerName: 'D.O (mg/I)', width: cWidth },
						{ field: 'ph', filterable: isMedium, sortable: false, headerName: 'PH', width: cWidth },
						{ field: 'conduct', filterable: isMedium, sortable: false, headerName: 'Conduct', width: cWidth },
				  ]
				: // for small devices
				  [
						{ field: 'name', headerName: 'Name', flex: 1, filterable: isMedium },
						{ field: 'location', filterable: isMedium, sortable: false, headerName: 'Location', width: cWidth },
						{ field: 'temperature', filterable: isMedium, sortable: false, headerName: 'Temperature', width: cWidth },
						{ field: 'oxygen', filterable: isMedium, sortable: false, headerName: 'D.O (mg/I)', width: cWidth },
						{ field: 'ph', filterable: isMedium, sortable: false, headerName: 'PH', width: cWidth },
						{ field: 'conduct', filterable: isMedium, sortable: false, headerName: 'Conduct', width: cWidth },
						{ field: 'classTeacherOf', sortable: false, headerName: 'Class', width: cWidth, filterable: isMedium },
				  ],
		[]
	);

	return (
		<>
			<Container maxWidth='xl' sx={{ mb: 8 }}>
				<Typography variant='h3' sx={{ my: 2 }}>
					Nationwide Water bodies data
				</Typography>
				<DataGrid
					onRowClick={e => navigate(`/dashboard/teacher/view/${e.id}`)}
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
					autoHeight
					hideFooter={!isMedium}
					rows={[
						{ id: 0, name: 'DAMANGANGA AT D/S OF MADHUBAN, DAMAN', location: 'DAMAN & DIU', temperature: '30.6', oxygen: '6.7', ph: '7.5', conduct: '203' },
						{ id: 1, name: 'ZUARI AT D/S OF PT. WHERE KUMBARJRIA CANAL JOINS, GOA', location: 'GOA', temperature: '29.8', oxygen: '5.7', ph: '7.2', conduct: '189' },
						{ id: 2, name: 'ZUARI AT PANCHAWADI', location: 'GOA', temperature: '29.5', oxygen: '6.3', ph: '6.9', conduct: '179' },
						{ id: 3, name: 'RIVER ZUARI AT BORIM BRIDGE', location: 'GOA', temperature: '29.7', oxygen: '5.8', ph: '6.9', conduct: '64' },
						{ id: 4, name: 'RIVER ZUARI AT MARCAIM JETTY', location: 'GOA', temperature: '29.5', oxygen: '5.8', ph: '7.3', conduct: '83' },
						{ id: 5, name: 'MANDOVI AT NEGHBOURHOOD OF PANAJI, GOA', location: 'GOA', temperature: '30', oxygen: '5.5', ph: '7.4', conduct: '81' },
						{ id: 6, name: 'MANDOVI AT TONCA, MARCELA, GOA', location: 'GOA', temperature: '29.2', oxygen: '6.1', ph: '6.7', conduct: '308' },
						{ id: 7, name: 'RIVER MANDOVI AT AMONA BRIDGE', location: 'GOA', temperature: '29.6', oxygen: '6.4', ph: '6.7', conduct: '414' },
						{ id: 8, name: 'RIVER MANDOVI AT IFFI JETTY', location: 'GOA', temperature: '30', oxygen: '6.4', ph: '7.6', conduct: '305' },
						{ id: 9, name: 'RIVER MANDOVI NEAR HOTEL MARRIOT', location: 'GOA', temperature: '30.1', oxygen: '6.3', ph: '7.6', conduct: '77' },
						{ id: 10, name: 'RIVER KALNA AT CHANDELNAN PERNEM, GOA', location: 'GOA', temperature: '27.8', oxygen: '7.1', ph: '7.1', conduct: '176' },
						{ id: 11, name: 'RIVER ASSONORA AT ASSONORA, GOA', location: 'GOA', temperature: '27.9', oxygen: '6.7', ph: '6.4', conduct: '93' },
						{ id: 12, name: 'RIVER BICHOLIM VARAZAN NAGAR , BICHOLIM', location: 'GOA', temperature: '29.3', oxygen: '7.4', ph: '6.8', conduct: '121' },
						{ id: 13, name: 'RIVER CHAPORA NEAR ALORNA FORT ,PERNEM', location: 'GOA', temperature: '29.2', oxygen: '6.9', ph: '7', conduct: '620' },
						{ id: 14, name: 'RIVER CHAPORA AT SIOLIM', location: 'GOA', temperature: '30', oxygen: '6', ph: '7.5', conduct: '72' },
						{ id: 15, name: 'RIVER KHANDEPAR AT OPA NAN PONDA, GOA', location: 'GOA', temperature: '29', oxygen: '7.3', ph: '7', conduct: '247' },
						{ id: 16, name: 'RIVER KHANDEPAR AT CODLI NEAR BRIDGE ,U/S OPA WATERWORKS,SANGUEM', location: 'GOA', temperature: '29.1', oxygen: '7.3', ph: '7', conduct: '188' },
						{ id: 17, name: 'RIVER KUSHAWATI NEAR BUND AT KEVONA,RIVON,SANGUEM', location: 'GOA', temperature: '28.7', oxygen: '7', ph: '6.9', conduct: '224' },
						{ id: 18, name: 'RIVER MADAI AT DABOS NAN VALPOI, GOA', location: 'GOA', temperature: '28.7', oxygen: '7.3', ph: '6.7', conduct: '144' },
						{ id: 19, name: 'RIVER MAPUSA ON CULVERT ON HIGHWAY MAPUSANANPANAJI', location: 'GOA', temperature: '29.5', oxygen: '5.3', ph: '6.8', conduct: '319' },
						{
							id: 20,
							name: 'RIVER SAL PAZORKHONI,CUNCOLIM(NEAR CULVERT MARGAONAN CANACONA NATIONAL HIGHWAY)',
							location: 'GOA',
							temperature: '29',
							oxygen: '6.3',
							ph: '6.4',
							conduct: '79',
						},
						{ id: 21, name: 'RIVER SAL NEAR HOTEL LEELA MOBOR,CAVELOSSIM', location: 'GOA', temperature: '29.4', oxygen: '5.4', ph: '7.6', conduct: '39' },
						{ id: 22, name: 'RIVER SAL AT KHAREBAND, MARGAO', location: 'GOA', temperature: '28.3', oxygen: '2.2', ph: '6.5', conduct: '322' },
						{ id: 23, name: 'RIVER SAL AT ORLIM BRIDGE, ORLIM', location: 'GOA', temperature: '30.1', oxygen: '5.2', ph: '7.1', conduct: '192' },
						{ id: 24, name: 'RIVER SINQUERIM (CANDOLIM SIDE NEAR BRIDGE)', location: 'GOA', temperature: '30.3', oxygen: '5.6', ph: '7.5', conduct: '282' },
						{ id: 25, name: 'RIVER SINQUERIM NEAR NERUL TEMPLE', location: 'GOA', temperature: '30.5', oxygen: '5.5', ph: '7.4', conduct: '275' },
					]}
					columns={columns}
					getRowId={row => row.id}
				/>
			</Container>
		</>
	);
}
