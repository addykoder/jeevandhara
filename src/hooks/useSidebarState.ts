import { useState } from "react"
import { createContext } from "react"

export default function useSidebarState(defaultValue : boolean):[boolean, ()=>void] {

	const [state, setState] = useState(defaultValue)
	function toggleState(stateV?:boolean) {
		setState(stateV === undefined? !state: stateV)
	}
	
	return [state, toggleState]
}

export const sidebarStateContext = createContext<[boolean, (i?:boolean)=>void]>([false, ()=>undefined])