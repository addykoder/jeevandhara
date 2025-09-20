
import { Outlet, useMatch, useNavigate, useResolvedPath } from 'react-router-dom';
import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import Styles from './styled';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { ReactNode, useContext } from 'react';
import { useMediaQuery } from '@mui/material';
import { sidebarStateContext } from '../../hooks/useSidebarState';
import Info from '../info/Info';
import useVerifyLogin from '../../hooks/useVerifyLogin';

export default function Sidebar() {
	const matches800p = useMediaQuery('(min-width:900px)');
	const matches600p = useMediaQuery('(min-width:600px)');
	// will redirect to login if not logged in 
	useVerifyLogin('login')

	const [state, toggleState] = useContext(sidebarStateContext);

	return (
		<>
			
			<Styles isOpened={state} isMobile={!matches600p} isSmall={!matches800p && matches600p}>
				{/* <Hamburger/> */}
				<ProSidebar defaultCollapsed={!matches800p && matches600p} collapsedWidth='75px'>
					<Menu>
						<div className='itemsDiv'>
							<div>
								<Item title='Dashboard' to='/dashboard/admin' icon={<DashboardOutlinedIcon fontSize='large' />} />
								<Item title='Report' to='/dashboard/attendance' icon={<EventNoteOutlinedIcon fontSize='large' />} />
								<Item title='Government Helplines' to='/dashboard/reschedules' icon={<EventAvailableOutlinedIcon fontSize='large' />} />
								<Item title='Water Bodies' to='/dashboard/teacher' icon={<PeopleOutlineOutlinedIcon fontSize='large' />} />
								<Item title='Testing Kit' to='/dashboard/help' icon={<ViewListOutlinedIcon fontSize='large' />} />
							</div>
							<div>
								<Item title='Help' to='/dashboard/help' icon={<HelpOutlineOutlinedIcon fontSize='large' />} />
								<Item title='Preferences' to='/dashboard/preferences' icon={<SettingsOutlinedIcon fontSize='large' />} />
								<Item title='Account' to='/dashboard/account' icon={<AccountCircleOutlinedIcon fontSize='large' />} />
							</div>
						</div>
					</Menu>
				</ProSidebar>
				<div
					className='content'
					onClick={() => {
						toggleState(false);
					}}
				>
					<Outlet />
				</div>
			</Styles>
		</>
	);
}

function Item({ title, icon, to }: { active?: boolean; title: string; icon: unknown; to: string }) {
	const resolvedPath = useResolvedPath(to);
	const isActive = useMatch({ path: resolvedPath.pathname + '/*' });
	const [, toggleState] = useContext(sidebarStateContext);
	const navigate = useNavigate();

	return (
		<div onClick={() => toggleState(false)} className={`menuItem ${isActive ? 'active' : ''}`}>
			<MenuItem onClick={() => navigate(to)} icon={icon as ReactNode}>
				{title}
			</MenuItem>
		</div>
	);
}