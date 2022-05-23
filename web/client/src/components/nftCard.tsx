import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import React from 'react'

export default function NftCard()
{
    const nftToken:any = {}
    return(
        <Grid item>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>NFT token Issued!</Typography>
                    <Typography variant="h5" component="div">{nftToken.FileName}</Typography>
                    <Typography color="text.secondary">{nftToken.Format}</Typography>
                    <Typography variant="body2">ID={nftToken.ID}</Typography>
                </CardContent>
                <CardActions>
                    <Typography variant="body2">IPFS-URI</Typography>
                    <Typography>{nftToken.URI}</Typography>
                </CardActions>
            </Card>
        </Grid>
    )
}
