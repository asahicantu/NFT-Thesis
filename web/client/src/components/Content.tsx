import React, { ReactNode, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { ClientContextType } from '../@types/clientContextType'
import moment from 'moment'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import { Guid } from 'guid-typescript'
import { ClientContext } from '../context/clientContext'
import axios from "axios";
import MintNFT from './MintNFT'
import RegisterOrganization from './RegisterOrganization'
import EnrollUser from './EnrollUser'
import Main from './Main'
import NFTTokens from './NFTTokens'

export default function Content() {
    const {openMain, openRegisterOrganization, openEnrollUser, openMintNFT,openNFTTokens } = React.useContext(ClientContext) as ClientContextType
    if(openMain){
        return (<Main/>)
    }
    if(openRegisterOrganization){
        return (<RegisterOrganization />)
    }
    if(openEnrollUser){
        return(<EnrollUser/>)
    }
    if(openMintNFT){
        return(<MintNFT/>)
    }
    if (openNFTTokens) {
        return (<NFTTokens />)
    }
    return (<Main/>)
}
