import styled from 'styled-components';

export default styled.div<{ isMobile: boolean }>(({ theme, isMobile }) => `
	background-color: ${isMobile ? theme.primary75 : theme.bg};
	backdrop-filter: blur(10px);
	position:sticky;
	top:0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: ${isMobile ? '0' : '0em'} 1.5em ;
	z-index: 100;
	//hiding the navbar when printing
	@media print{
		/* display:none!important; */
	}

	& .hamburger{
		scale: ${isMobile ? '.8' : '1'};
		opacity: .9;
		position: relative;
		-webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
		&:focus{
		outline: none !important;
		}
	}

	& .info{
		margin-right: 1em;
		font-size: 1.6rem;
		letter-spacing: 1px;
		font-weight: 100;
		display:flex;
		gap:1em;

		& span{
			opacity: .6;
		}

		@media print{
			display:none;
		}
	}
	& #logo{
		width: ${isMobile ? '30px' : '40px'};
		aspect-ratio:1/1;

		@media print{
			margin-left: 2em;
			margin-right: 2em;
		}
	}

	& .logoText{
		display:flex;
		align-items: center;
		flex-direction:${isMobile ? 'row-reverse' : ''};
		margin-block: 1em;
		@media print{
			margin-inline:auto;
		}

		& span{
			@media screen and (max-width: 600px){
				margin-right: 1em;
			}
			@media screen and (min-width: 600px){
				margin-inline: 1em;
			}

			font-size: 2.3rem;
			opacity: .8;
		}
	}
`
);
