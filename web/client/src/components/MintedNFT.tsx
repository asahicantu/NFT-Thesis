import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import React from 'react'
import { NFT } from '../../../common/nft'
import { Button } from '@mui/material'

export default function NftCard(props: { nftToken: NFT | undefined }) {
    const nftToken = props.nftToken
    if (!nftToken) {
        return <React.Fragment />
    }
    console.log(nftToken.FileName)
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant='h5'>NFT token Issued!</Typography>
                <Typography variant="body1">File name: {nftToken.FileName}</Typography>
                <Typography color="white" variant="body2">Data-Type:{nftToken.FileFormat}</Typography>
                <Typography variant="body2">NFT-ID={nftToken.ID}</Typography>
            </CardContent>
            <CardActions>
                <Typography variant="body2">IPFS-URI:</Typography>
                <Button sx={{fontSize:12}}>
                    {nftToken.URI}
                </Button>
            </CardActions>
        </Card>
    )
}
