import { useState } from "react"

const key = 'token'

export default function useSavedToken():[string, (token:string)=>void] {
	
  const [token, setToken] = useState(localStorage.getItem(key) || '')

	function modifyToken(value: string) {
		setToken(value)
		localStorage.setItem(key, value)
	}

  return [token, modifyToken]
}