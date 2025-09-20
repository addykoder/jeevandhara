import { Box } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

export default function Loader({ height, width }:{height?:number, width?:number}) {
	return <Box sx={{width:'max-content', margin:'auto'}}>
		<ThreeDots color='white' height={height} width={width}/>
	</Box>
}