import React,  {Dispatch, SetStateAction } from 'react'
type ClientContextType = {
    appName: string,
    loading: boolean,
    setLoading:Dispatch<SetStateAction<boolean>>
    error: string,
    setError: Dispatch<SetStateAction<string>>
    onMintToken(): void
}

export type { ClientContextType }
