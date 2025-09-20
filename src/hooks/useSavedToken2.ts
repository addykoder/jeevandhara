import { useState } from "react"

export default function useSavedToken():[string, (token:string)=>void] {
  const [value, setValue] = useState(() => {
    const token = localStorage.getItem('token')
    if (token) return token
    return ''
  })

	function setToken(token:string){
		setValue(token)	
    localStorage.setItem('token', token)
  }

  return [value, setToken]
}