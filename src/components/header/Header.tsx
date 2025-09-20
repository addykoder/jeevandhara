import { Outlet, useNavigate } from 'react-router-dom';
import Styles from './styled';
import { useMediaQuery } from '@mui/material';
import { Spin as Hamburger } from 'hamburger-react';
import { useContext } from 'react';
import { sidebarStateContext } from '../../hooks/useSidebarState';
import { useMatch, useResolvedPath } from 'react-router-dom';
import Info from '../info/Info';

export default function Header() {
	const matches600p = useMediaQuery('(min-width:600px)');
	const [state, toggleState] = useContext(sidebarStateContext);
	const resolvedPath = useResolvedPath('/dashboard');
	const isDashboard = useMatch({ path: resolvedPath.pathname + '/*' });
	const navigate = useNavigate()

	return (
		<>
			<Styles isMobile={!matches600p}>
				{!matches600p && isDashboard && (
					<div className='hamburger'>
						<Hamburger
							rounded
							label='show menu'
							toggled={state}
							onToggle={() => {
								toggleState();
							}}
						/>
					</div>
				)}
				<div className='logoText point' onClick={()=>navigate('/homepage')}>
					<img id='logo' src='/icon512.png' alt='' />
					<span>Jeevandhara</span>
				</div>
				{matches600p && <Info/>}

				{}
				{/* <div id='watermark' style={{ display: 'flex', overflow: 'hidden', width: '95vw', justifyContent:'center'}}>
					<img src="icon512.png" />
				</div> */}
			</Styles>

			<Outlet />
		</>
	);
}
