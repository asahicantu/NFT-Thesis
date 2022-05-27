import React,  {Dispatch, SetStateAction } from 'react'
type ClientContextType = {
    appName: string,
    loading: boolean,
    setLoading:Dispatch<SetStateAction<boolean>>
    error: string,
    setError: Dispatch<SetStateAction<string>>
    onMintToken(): void,
    openMain: boolean,
    setOpenMain: Dispatch<SetStateAction<boolean>>,
    openMintNFT:boolean,
    setOpenMintNFT: Dispatch<SetStateAction<boolean>>,
    openRegisterOrganization: boolean,
    setOpenRegisterOrganization: Dispatch<SetStateAction<boolean>>,
    openEnrollUser: boolean,
    setOpenEnrollUser: Dispatch<SetStateAction<boolean>>
}

export type { ClientContextType }
