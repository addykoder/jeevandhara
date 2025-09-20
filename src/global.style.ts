import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

@media print{
	*{
		opacity:1!important;
		color:black;
	}
}

#watermark {
	display:none!important;
	position: fixed;
	opacity: .1!important;
	font-size: 120px;
	top:30vh;
	color: white;
	text-align: center;
	background-color: transparent;
	z-index: -100;
	@media print{
		display:block!important;
		position:fixed!important;
	}
}
@page{
	/* margin-top:.6cm!important; */
}

.recharts-dot{
	cursor: pointer;
}


div.link{
	display:inline;
	&>span{
	margin-block: 1em;
	background-color: black;
	display:none;
	font-weight: 100;
	letter-spacing: 2px;
	padding: .5em 1em;
	border-radius: 10px;
}
&:hover>span{
	display:inline;
}
}


:root{
	--color-bg:rgb(5, 15, 32);
	--color-bg-light: rgb(27, 40, 59);
	--color-bg-light-dark: rgb(16, 26, 41);
	--color-accent: rgb(0, 153, 255);
}
	.point:hover{
		cursor: pointer;
	}
	.MuiFormHelperText-root {
		font-size: 1rem !important;
  color: rgb(256,0,0) !important;
	}
  body {
    margin: 0;
    background: #050f20;
		font-family: 'IBM Plex Sans', sans-serif;
  }

	#root, body, .App{
		/* height: 100vh; */
	}

	.App{
		display:flex;
		flex-direction: column;
	}
	
	::-webkit-scrollbar{
		width: 7px;
		height: 7px;
		background-color: transparent;
		border-radius: 5em;
	}	
	::-webkit-scrollbar-thumb{
		background-color: white;
		background-color: rgb(90,90,90);
		border-radius: 5em;
	}

	@media (max-width:1400px) {
		:root{
			font-size: 14px;
		}	
	}

	@media (max-width: 800px){
		:root{
			font-size: 11px;
		}
	}

	.toast-message{
		backdrop-filter: blur(20px);
		color: white;
		background-color: rgb(124 189 255 / 30%);
	}

`;

export default GlobalStyle;
