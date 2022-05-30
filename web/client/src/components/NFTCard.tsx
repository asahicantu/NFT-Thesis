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
                'Content-type': 'application/json',
            },
            maxBodyLength: Number(process.env.REACT_APP_MAX_FILE_SIZE),
            maxContentLength: Number(process.env.REACT_APP_MAX_FILE_SIZE),
        }
        try {
            let bufferData: Array<number> = []
            const response = await axios.get(`ipfs/cat?path=${nft.URI}`, config)
            for(var i = 0;i< response.data.length;i++){
                bufferData = bufferData.concat(response.data[i].data)
            }
            console.log(bufferData)
            const buffer = Buffer.from(bufferData)
            // console.log(buffer)
            // const ipfsFile: any = response.data.files as Array<any>
            // var buffers: Array<Buffer> = []
            // console.log(buffers)
            // for (var i = 0; i < ipfsFile.length; i++) {
            //     const b = Buffer.from( ipfsFile[i].data)
            //     console.log(b)
            //     buffers.concat(Buffer.from('s'))
            // }
            // const buffer = Buffer.concat(buffers)
            var blob = new Blob([new Uint8Array(bufferData)], { type: "text/plain;charset=utf-8" })
            var opt:FileSaverOptions = {autoBom:false}
            FileSaver.saveAs(blob, nft.FileName, opt)
        }
        catch (error) {
            LogMessage(error, 'error')
        }
        finally {
            setLoading(false)
        }

        // .then((response) => {
        //     const ipfsFile = response.data as IPFSFile
        //     console.log(response.data)

        //     LogMessage('File has been saved in ', 'success')
        // }
        // ).catch((error: AxiosError) => {
        //     if (error && error.response && error.response.data) {
        //         console.log(error);
        //         const messageData = error.response.data as any
        //         LogMessage(messageData.message, 'error')
        //     }
        // }).finally(() => {
        //     setLoading(false)
        // });
    }

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="body1">File name: {nftToken.FileName}</Typography>
                <Typography color="white" variant="body2">Data-Type:{nftToken.FileFormat}</Typography>
                <Typography variant="body2">NFT-ID={nftToken.ID}</Typography>
            </CardContent>
            <CardActions>
                <Typography variant="body2">IPFS-URI:</Typography>
                <Button sx={{ fontSize: 12 }} onClick={handleClick}>
                    {nftToken.URI}
                </Button>
                <Button startIcon={<Download />} color="primary" variant="contained" aria-label="download" onClick={() => { handleDownload(nftToken!) }}>Download</Button>
            </CardActions>
        </Card>
    )
}
