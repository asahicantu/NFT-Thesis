import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { ClientContext } from '../context/clientContext'
import { ClientContextType } from '../@types/clientContextType'
import './loader.css'
export default function Loader() {
    const { loading } = React.useContext(ClientContext) as ClientContextType
    return (
        loading ?
            <Box className="loader" sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box> :
            <div />
    )
}
