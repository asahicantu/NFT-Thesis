import { AlertColor } from '@mui/material'
import React, { ReactElement, ReactNode } from 'react'
import { ClientContextType } from '../@types/clientContextType'

const ClientContext = React.createContext<ClientContextType | null>(null)
function ClientProvider(props: { children: ReactNode }): ReactElement {
    const [loading, setLoading ] = React.useState(false)
    const [openMain, setOpenMain] = React.useState(false)
    const [openMintNFT, setOpenMintNFT] = React.useState(false)
    const [openNFTTokens, setOpenNFTTokens] = React.useState(false)
    const [openRegisterOrganization, setOpenRegisterOrganization] = React.useState(false)
    const [openEnrollUser, setOpenEnrollUser] = React.useState(false)
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('ok')
    const [snackbarType, setSnackbarType] = React.useState<AlertColor>('success')

    const appName = 'HYP_NFT'

    function LogMessage(message: any, type: AlertColor ){
        console.log(message)
        setSnackbarType(type)
        const msg = message.toString()
        setSnackbarMessage(msg)
        setOpenSnackbar(true)
    }

    return (
        <ClientContext.Provider value={
            {
                appName,
                loading,
                setLoading,
                openMain,
                setOpenMain,
                openMintNFT,
                setOpenMintNFT,
                openNFTTokens,
                setOpenNFTTokens,
                openRegisterOrganization,
                setOpenRegisterOrganization,
                openEnrollUser,
                setOpenEnrollUser,
                openSnackbar,
                setOpenSnackbar,
                snackbarMessage,
                setSnackbarMessage,
                snackbarType,
                setSnackbarType,
                LogMessage
            }}>
            {props.children}
        </ClientContext.Provider>
    )
}
export { ClientProvider, ClientContext }
