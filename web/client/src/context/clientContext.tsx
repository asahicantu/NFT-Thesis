import React, { ReactElement, ReactNode } from 'react'
import { ClientContextType } from '../@types/clientContextType'

const ClientContext = React.createContext<ClientContextType | null>(null)
function ClientProvider(props: { children: ReactNode }): ReactElement {
    const [loading, setLoading ] = React.useState(false)
    const [error, setError] = React.useState('')
    const [openMain, setOpenMain] = React.useState(false)
    const [openMintNFT, setOpenMintNFT] = React.useState(false)
    const [openRegisterOrganization, setOpenRegisterOrganization] = React.useState(false)
    const [openEnrollUser, setOpenEnrollUser] = React.useState(false)

    const appName = 'HYP_NFT'

    const onMintToken = () => {
        //token data
    }
    return (
        <ClientContext.Provider value={
            {
                appName,
                loading,
                setLoading,
                error,
                setError,
                openMain,
                setOpenMain,
                onMintToken,
                openMintNFT: openMintNFT,
                setOpenMintNFT: setOpenMintNFT,
                openRegisterOrganization: openRegisterOrganization,
                setOpenRegisterOrganization: setOpenRegisterOrganization,
                openEnrollUser: openEnrollUser,
                setOpenEnrollUser: setOpenEnrollUser
            }}>
            {props.children}
        </ClientContext.Provider>
    )
}
export { ClientProvider, ClientContext }
