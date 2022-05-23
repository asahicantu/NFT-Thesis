import React, { ReactElement, ReactNode } from 'react'
import { ClientContextType } from '../@types/clientContextType'

const ClientContext = React.createContext<ClientContextType | null>(null)
function ClientProvider(props: { children: ReactNode }): ReactElement {
    const [loading, setLoading ] = React.useState(false)
    const [error, setError] = React.useState('')
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
                onMintToken
            }}>
            {props.children}
        </ClientContext.Provider>
    )
}
export { ClientProvider, ClientContext }
