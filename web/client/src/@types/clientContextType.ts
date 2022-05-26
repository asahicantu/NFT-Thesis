import React,  {Dispatch, SetStateAction } from 'react'
type ClientContextType = {
    appName: string,
    loading: boolean,
    setLoading:Dispatch<SetStateAction<boolean>>
    error: string,
    setError: Dispatch<SetStateAction<string>>
    onMintToken(): void,
    openMintNFTModal:boolean,
    setOpenMintNFTModal: Dispatch<SetStateAction<boolean>>,
    openRegisterOrganizationModal: boolean,
    setOpenRegisterOrganizationModal: Dispatch<SetStateAction<boolean>>,
    openEnrollUserModal: boolean,
    setOpenEnrollUserModal: Dispatch<SetStateAction<boolean>>
}

export type { ClientContextType }
