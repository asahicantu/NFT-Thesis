import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import React from 'react'
import { NFT } from '../../../common/nft'
import { Button } from '@mui/material'
import { ClientContextType } from '../@types/clientContextType'
import { ClientContext } from '../context/clientContext'

export default function NFTCard(props: { nftToken: NFT | undefined }) {
    const { LogMessage } = React.useContext(ClientContext) as ClientContextType
    const nftToken = props.nftToken
    if (!nftToken) {
        return <React.Fragment />
    }

    const handleClick = () => {
        if (nftToken && nftToken.URI) {
            navigator.clipboard.writeText(nftToken.URI)
            const url = `http://localhost:8080/#/ipfs/${nftToken.URI}`
            window.open(url, '_blank', 'noopener, noreferrer')
            LogMessage('Token URI has been copied to the clipboard','info')
        }
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
            </CardActions>
        </Card>
    )
}
