import styled from "styled-components";

export default styled.div<{ isSmall: boolean }>(({ theme, isSmall }) => `

	div.item{
		border-radius: 10px;
		padding: .8em 1em;
		justify-items:center;
		/* background-color: ${theme.primary75}; */
			border:1px solid transparent;
			background-color: ${theme.primary60};
		&:hover{
			/* transform: scale(${isSmall ? '1' : '1.03'}); */
		border: 1px solid gray;
		background-color: transparent;
		}
		transition: all .1s .05s linear;

	}

	.container{
		display:${isSmall ? 'flex' : 'grid'};
		flex-direction: column;
		row-gap: 2em;
		column-gap: 2em;
		gap: ${isSmall?'4em!important;':''}
		grid-template-columns: ${isSmall ? '1fr' : '1fr 1fr 1fr'};
	}

	.vulnerabilities{
		grid-column: 1/span ${isSmall ? '1' : '3'};
	}
	.line{
		display:flex;
		align-items:center;
		gap:1em;
	}
	.attendance{
		grid-column: 1/span 1;
		grid-row: 2/span 3;

		display:flex;
		flex-direction: column;
		justify-content:space-evenly;
		padding-left: 2em!important;
	}

	.reschedules{
		grid-column: ${isSmall ? '1' : '2'}/span 1;
		grid-row: 2/span 3;

		display:flex;
		flex-direction: column;
		justify-content:space-evenly;
		padding-left: 2em!important;
	}
	.attchart{
		grid-column: 1/span 2;
		max-width:88vw;
		overflow-x:auto;	
		overflow-y:hidden;
		position:relative;
	}

	.clock{
		grid-column: ${isSmall ? '1' : '3'}/span 1;
	}
	.preferences{
		grid-column: 1/span ${isSmall ? '1' : '2'};
		grid-row: 5/span 2;
		
		& .list{
		display:flex !important;
		/* gap:2em; */
		alignItems:'center';
		justify-content:space-between;
		@media (max-width:700px){
			flex-direction: column;
		}
		flex-wrap:wrap;
		padding-left: 1em!important;
		/* gap:1em; */
			&>.line{
				${isSmall ? '' : 'padding - left: 4em;'}
			}
			& :nthChild()
		}
	}

	.tip{
		grid-column: 3/span 1;
		grid-row: 3/span 5;
		height: max-content;
		@media (max-width:1200px){
			grid-column: 1/span 1
		}
	}


`)