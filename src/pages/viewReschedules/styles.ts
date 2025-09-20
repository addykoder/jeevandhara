import styled from "styled-components";


export default styled.div(({ theme }) => `

& .summary{
	@media screen and (max-width:1500px){
		overflow-x: auto;
		max-width: 1100px;
	}

	@media screen and (max-width:1200px){
		overflow-x: auto;
		max-width: 900px;
	}

	@media screen and (max-width: 900px) {
			max-width: 65vw;
			& table td div{
			font-size: .8rem!important;
			width: 30px;
		}
			& table td {
			font-size: .8rem!important;}
	}

	@media screen and (max-width: 600px) {
			max-width: 78vw;
			& table td div{
			font-size: .8rem!important;
			width: 30px!important;
		}
			& table td {
			font-size: .8rem!important;}
	}
}


& .timetableBlock+.timetableBlock{
	border-left: 1px solid grey;
}
& tr+tr>td:first-child{
	border-top: 1px solid rgba(70,70,70,.5)!important;
	@media print{
		border-top: 1px solid rgba(150,150,150,.5)!important;
	}
}
& .blackOutline{
	@media print{
		outline: 2px solid black!important;
		border: 1px solid black!important;
	}
}
& .blackDotted{
	@media print{
		outline: 2px dotted black!important;
		border: 1px dotted black!important;
	}
}

& .printBlock{
	@media print{
		break-inside:avoid;
		page-break-inside:avoid;
		/* display:table; */
	}
}

& .onPrint{
	display:none;
	@media print{
		display:block;
		margin-bottom: 4em !important;
	}
}

& .watermark {
	display:none;
	&>*{
		margin:0;
		text-align:center;
	}
	
	@media print{
			display: block!important;
			font-weight: 1000;
			color: rgba(10,10,10,.2)!important;
			& h1{
				color: rgba(10,10,10,.2)!important;
			}
			font-size: 5rem;
			display: block;  
			position: fixed;  
			bottom: 15vh; 
			&.w1{
			transform: rotate(-90deg) translateY(-330px) translateX(150px);
			}
			&.w2{
			transform: rotate(90deg) translateY(-380px) translateX(-350px);
			}
	}
}
& .reschedulesHeader{
	@media print{
		margin-bottom: 1em!important;
	}
}

& .hideOnPrint{
	@media print{
		display:none;
	}
}


& .adityaTripathi{

		margin-top: 2em;
		background-color: ${theme.primary50};
		border-radius: 10px;
		padding: 1em;
		margin: 1em 1em;
		font-size: 0.9rem;
		text-align: center;
		font-weight: 100;
		opacity: .8;
		line-height: 1.5em;
		transition: all .3s;
		/* @media print { 
			font-weight: 200;
			font-size: .9rem;
			display: block;  
			position: fixed;  
			bottom: 15vh; 
			transform: rotate(-90deg) translateY(-130px);
		}  */
		@media print{
		display:none!important;
		border: 1px solid grey;
		font-size:1.2rem;
			display:flex;
			flex-direction:column;
			align-item:center;
			justify-content:space-around;
			gap: 1em;

		.appLink, .websiteLink{
			display:block!important;
		}
		.mylink{
			border-color:transparent;
		}

		color:grey!important;
			& .appLink{
				font-weight: 100!important;
			}
			a.link{
				font-weight: 400!important;
				color: black;
				opacity:1!important
			}
			a{
				border:none;
			}
		}

		.appLink, .websiteLink{
			display:none
		}
		@media (min-width: 600px){
			width:max-content;
			margin-inline:auto;
		}
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
`)