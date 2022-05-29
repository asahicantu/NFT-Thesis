import { AlertColor } from '@mui/material'
import  { Dispatch, SetStateAction } from 'react'
type LogMessage = (message: any, messageType: AlertColor) => void;
type ClientContextType = {
    appName: string,
    loading: boolean,
    setLoading: Dispatch<SetStateAction<boolean>>
    openMain: boolean,
    setOpenMain: Dispatch<SetStateAction<boolean>>,
    openMintNFT: boolean,
    setOpenMintNFT: Dispatch<SetStateAction<boolean>>,
    openNFTTokens: boolean,
    setOpenNFTTokens: Dispatch<SetStateAction<boolean>>,
    openRegisterOrganization: boolean,
    setOpenRegisterOrganization: Dispatch<SetStateAction<boolean>>,
    openEnrollUser: boolean,
    setOpenEnrollUser: Dispatch<SetStateAction<boolean>>,
    openSnackbar: boolean,
    setOpenSnackbar: Dispatch<SetStateAction<boolean>>,
    snackbarMessage: string,
    setSnackbarMessage: Dispatch<SetStateAction<string>>,
    snackbarType: AlertColor,
    setSnackbarType: Dispatch<SetStateAction<AlertColor>>,
    LogMessage: LogMessage
}

export type { ClientContextType, LogMessage }
