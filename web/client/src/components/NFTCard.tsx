import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import React, { createRef } from 'react'
import { NFT } from '../../../common/nft'
import { Button, IconButton } from '@mui/material'
import { ClientContextType } from '../@types/clientContextType'
import { ClientContext } from '../context/clientContext'
import Download from '@mui/icons-material/Download';
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import IPFSFile from '../../../common/IPFSFile'
import { Buffer } from 'buffer';
import FileSaver, { FileSaverOptions } from 'file-saver'
import { LocalGroceryStoreRounded } from '@mui/icons-material'
import { resolveNaptr } from 'dns'
export default function NFTCard(props: { nftToken: NFT | undefined }) {
    const { LogMessage, setLoading } = React.useContext(ClientContext) as ClientContextType
    const nftToken = props.nftToken
    if (!nftToken) {
        return <React.Fragment />
    }

    const handleClick = () => {
        if (nftToken && nftToken.URI) {
            navigator.clipboard.writeText(nftToken.URI)
            const url = `http://localhost:8080/#/ipfs/${nftToken.URI}`
            window.open(url, '_blank', 'noopener, noreferrer')
            LogMessage('Token URI has been copied to the clipboard', 'info')
        }
    }
    const handleDownload = async (nft: NFT) => {
        setLoading(true)
        const config: AxiosRequestConfig = {
            baseURL: process.env.REACT_APP_BASE_URL as string,
            headers: {
                'Accept': '*/*',
            },
            responseType :'arraybuffer',
            maxBodyLength: Number(process.env.REACT_APP_MAX_FILE_SIZE),
            maxContentLength: Number(process.env.REACT_APP_MAX_FILE_SIZE),
        }
        try {
            const response = await axios.get(`ipfs/cat?path=${nft.URI}`, config)
            console.log(response.data)
            var arr = new Uint8Array(response.data)
            var blob = new Blob([arr],{ type: 'application/octet-stream'})
            FileSaver.saveAs(blob, nft.FileName)
        }
        catch (error) {
            LogMessage(error, 'error')
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="body1">File name: {nftToken.FileName}</Typography>
                <Typography variant="body2">Date:{new Date(nftToken.Date!).toDateString()}</Typography>
                <Typography color="white" variant="body2">Data-Type:{nftToken.FileFormat}</Typography>
                <Typography variant="body2">NFT-ID={nftToken.ID}</Typography>
            </CardContent>
            <CardActions>
                <Typography variant="body2">IPFS-URI:</Typography>
                <Button sx={{ fontSize: 12 }} onClick={handleClick}>
                    {nftToken.URI}
                </Button>
                <Button startIcon={<Download />} color="primary" variant="contained" aria-label="download" onClick={() => {handleDownload(nftToken!) }}>Download</Button>
            </CardActions>
        </Card>
    )
}
