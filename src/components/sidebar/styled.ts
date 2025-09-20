import styled from "styled-components";


export default styled.div<{ isMobile: boolean, isSmall: boolean, isOpened: boolean }>(({ theme, isMobile, isSmall, isOpened }) => `
	flex-grow:1;
	display:flex;
	position: relative;


	& .info{
		margin-inline: .5em;
		font-size: 1.6rem;
		letter-spacing: 1px;
		font-weight: 100;
		display:flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap:1em;
		border-radius: 20px;

		& span{
			opacity: .6;
			text-align: center;
		}
	}


	& .adityaTripathi{
		margin-top: 2em;
		display: ${isSmall ? 'none' : 'block'};
		background-color: ${theme.primary50};
		border-radius: 10px;
		padding: 1em;
		margin: 2em 1em;
		font-size: 0.9rem;
		text-align: center;
		font-weight: 100;
		opacity: .8;
		line-height: 1.5em;
		transition: all .3s;
		& a{
			font-weight: 400;
			color: ${theme.primarySelected};
			text-decoration: none;
			border-bottom: 2px dotted ${theme.primary};
		}

		&:hover{
			opacity:1;
			background-color: ${theme.primary80};
		}
	}

	& .content{
		padding: 1em .5em;
		opacity: ${isOpened ? '.4' : '1'};
		min-height: 90vh;
		flex-grow:1;
	}
	& .menu{
		display:flex;
		align-items: center;
		justify-content:space-between;
		flex-direction: column;
	}

	& .ps-sidebar-container{
		background-color: transparent;
		display:flex;
		flex-grow:1;
		& .ps-menu-root{
			display:flex;
			flex-grow:1;
			& ul{
				flex-grow:1;
				display:flex;
				flex-direction: column;
			}
		}
	}

	& aside{
		border:none;
		width: 240px;
		align-items:center;
		justify-content:center;
		display:flex;
		height: ${isMobile ? '94' : '88'}vh;
		position: sticky;
		top: ${isMobile? '7em':'5em'};
		transition: transform .3s;
		position: ${isMobile?'fixed':''};
		transform: ${isMobile?isOpened?'':'translate(-150%)':''} ${isMobile?'translateY(-22px)' : ''};
		background-color: ${isMobile?theme.blurbg:theme.bg};
		backdrop-filter: blur(15px);
		z-index: 100;
		$
	}

	& .ps-menu-button:hover{
		background-color: transparent !important;
	}
	
	& .navigationHeader{
		margin: 1em 1em;
		padding: 1.5em 1em;
		border-radius: 10px;
		display:flex;
		flex-direction: column;
		text-align: center;
		/* border: 1px solid ${theme.primary}; */
		background-color: ${theme.primary50};

		& h2{
			font-weight: 600;
			font-size: 2rem;
			margin: 0;
		}
		& span{
			font-size: 1rem;
			color: ${theme.primary}
		}

	}
	& .itemsDiv{
		display:flex;
		margin-top:1.5em;
		flex-direction: column;
		align-item:center;
		justify-content: space-between;
		flex-grow:1;
		padding-bottom: 1em;
		margin-bottom: 2em;
	}
	& .menuItem{
		margin-left: 1em; 	
		font-size: 1rem !important;
		color: #858dab;
		margin-block: 0.5em;
		border-radius: 5px;
		font-weight: 300;
		transition: transform .3s;

		&:hover{
			color: ${theme.primary};
		}

		&.active{
			background: linear-gradient(to left, rgba(25, 118, 210, 0), rgba(25, 118, 210, .3));
			color: ${theme.primarySelected};
			font-weight:400;
			transform: scale(1.1)
		}

		@media (max-width:1400px){
			margin-block:0;
			& .ps-menu-button{
				height: 40px;
			}
		}




	}

`)