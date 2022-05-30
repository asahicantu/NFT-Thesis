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
                //'Content-type': 'application/json',
            },
            responseType :'arraybuffer',
            maxBodyLength: Number(process.env.REACT_APP_MAX_FILE_SIZE),
            maxContentLength: Number(process.env.REACT_APP_MAX_FILE_SIZE),
        }
        try {
            const response = await axios.get(`ipfs/cat?path=${nft.URI}`, config)
            // var buffer = response.data as ArrayBuffer
            //var buffer = response.data as Buffer
            // const ipfsFiles = response.data as IPFSFile
            // const ipfsArray = ipfsFiles.files.join('')
            // console.log(ipfsArray)
            //console.log(response.data)
           // console.log(new Uint8Array(await response.data.arrayBuffer()))
            //console.log(new Uint8Array(response.data.arrayBuffer))
            console.log(response.data)
            var arr = new Uint8Array(response.data)
            console.log(arr)
            //const fArray = new TextEncoder().encode(response.data)
            //console.log(fAr)
            //console.log(fArray)
            // let bufferData: Uint8Array = new Uint8Array(response.data.length)
            // for(var i = 0;i< response.data.length;i++){
            //     for (var j = 0; j < response.data[i].data.length; j++) {
            //         bufferData[i] = response.data[i].data[j]
            //     }
            // }
            // console.log(response.data.length)
            // console.log(bufferData)
            // const buffer = Buffer.from(bufferData)
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
            // console.log(buffer.toString('utf8'))
            // var a = document.createElement("a");
            // document.body.appendChild(a);
            // a.style.display = "none"
            // //var blob = new Blob([fArray]),
            // var url = window.URL.createObjectURL(response.data)
            // a.href = url
            // a.download = nft.FileName!
            // a.click()
            // window.URL.revokeObjectURL(url)

            var blob = new Blob([arr],{ type: 'application/octet-stream'})
            FileSaver.saveAs(blob, nft.FileName)
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
                <Button startIcon={<Download />} color="primary" variant="contained" aria-label="download" onClick={() => {handleDownload(nftToken!) }}>Download</Button>
            </CardActions>
        </Card>
    )
}
