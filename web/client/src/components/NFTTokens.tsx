import React from 'react'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { ClientContextType } from '../@types/clientContextType'
import Stack from '@mui/material/Stack'
import { ClientContext } from '../context/clientContext'
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import style from '../@types/panelStyle'
import { NFT } from '../../../common/nft'
import NFTCard from './NFTCard'
import Chaincode from '../../../common/Chaincode'
import { Container, Panel } from 'react-scrolling-panel';
export default function NFTTokens() {
    const [nftTokens, setNftTokens] = React.useState<Array<NFT>>();
    const { setLoading, LogMessage } = React.useContext(ClientContext) as ClientContextType
    const displayTokens = () => {
        setLoading(true)
        const nftContent: Chaincode =
        {
            organization: "Org1",
            userId: "minter",
            channel: 'mychannel',
            name: 'erc721',
            functionName: "TotalSupply",
            params:
            {
            }
        }
        const config: AxiosRequestConfig = {
            baseURL: process.env.REACT_APP_BASE_URL as string,
            headers: {
                'Accept': '*/*',
                'Content-type': 'application/json',
            }
        }
        axios.post('nft/chaincode', nftContent, config)
            .then((response) => {
                const nfts = response.data as Array<NFT>
                setNftTokens(nfts);
            }).catch((error: AxiosError) => {
                if (error && error.response && error.response.data) {
                    console.log(error);
                    const messageData = error.response.data as any
                    LogMessage(messageData.message, 'error')
                }
            }).finally(() => {
                setLoading(false)
            })
    }

    if (!nftTokens) {
        return (
            <Box sx={style}>
                <Button variant="contained" onClick={displayTokens}>Load Tokens</Button>
            </Box>
        )

    }
    return (

        <Box sx={style} overflow="scroll">
            <Stack direction="column" spacing={1}>
                {nftTokens.map((nft) => (
                    <NFTCard key={nft.ID!} nftToken={nft}></NFTCard>
                ))}
            </Stack >
        </Box>
    )
}
