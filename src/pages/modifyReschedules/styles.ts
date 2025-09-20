
import styled from "styled-components";


export default styled.div(({ theme }) => `
& .draggablePeriodBlock:hover{
	cursor: grab;
	transform: scale(1.1);
	transition: transform .1s ease-out;
}

& .draggablePeriodBlock:active{
	cursor:grabbing;
	transform: scale(.9);
}
`);