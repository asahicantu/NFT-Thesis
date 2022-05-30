import React from 'react'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { ClientContextType } from '../@types/clientContextType'
import Stack from '@mui/material/Stack'
import { ClientContext } from '../context/clientContext'
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import style from '../@types/panelStyle'
import UploadFile from '@mui/icons-material/UploadFile';
import { NFT } from '../../../common/nft'
import NFTCard from './NFTCard'
import moment from 'moment'
export default function MintNFT() {
    const [fileName, setFileName] = React.useState<string>();
    const [nftToken, setNftToken] = React.useState<NFT>();
    const { setLoading, LogMessage } = React.useContext(ClientContext) as ClientContextType

    const handleFileClick = (e: React.SyntheticEvent) => {
        const inputFile: any = e.target as any;
        if (inputFile && inputFile.files) {
            const files = inputFile.files as FileList
            setFileName(files[0].name)
        }
    }
    const handleSubmission = (e: React.SyntheticEvent) => {
        e.preventDefault()
        setNftToken(undefined)
        const target = e.target as typeof e.target & {
            organization: { value: string }
            owner: { value: string }
            fileFormat: { value: string }
            file: { name: string, files: any }
        }

        const nftContent: any =
        {
            channel: 'mychannel',
            name: 'erc721',
            organization: target.organization.value,
            userId: target.owner.value,
            params:
            {
                FileFormat: target.fileFormat.value,
                Owner: target.owner.value,
                Organization: target.organization.value,
                FileName: fileName,
                Date: Date.now()
            },
        };

        var newFiles = target.file.files;
        var filesArr = Array.prototype.slice.call(newFiles);
        if(!filesArr || filesArr.length === 0){
            LogMessage('Must select a file first', 'info')
            return
        }
        const fl = filesArr[0] as File;
        console.log(fl)
        var reader = new FileReader();
        setLoading(true)
        reader.onload = function (e: any) {
            var data = Array.from(new Uint8Array(e.target.result))
            nftContent.data = JSON.stringify(data)
            console.log(nftContent.data)

            const config: AxiosRequestConfig = {
                baseURL: process.env.REACT_APP_BASE_URL as string,
                headers: {
                    'Accept': '*/*',
                    'Content-type': 'application/json',
                }
            }
            axios.post('nft/mint', nftContent,config)
            .then((response) => {
                const nft = response.data as NFT
                setNftToken(nft);
                LogMessage('Token has been minted', 'success')
            }
            ).catch((error: AxiosError) => {
                if (error && error.response && error.response.data){
                    console.log(error);
                    const messageData = error.response.data as any
                    LogMessage(messageData.message,'error')
                }
            }).finally(()=>{
                setLoading(false)
            });
        };
        reader.onerror = function (e) {
            // error occurred
            console.log('Error : ' + e.type);
            setLoading(false)
        };
        reader.readAsArrayBuffer(fl);
    }
    return (
        <Box sx={style}>
            <Stack
                direction="column"
                component="form"
                spacing={3}
                onSubmit={(e: React.SyntheticEvent) => { handleSubmission(e) }}>
                <Typography variant='h4'>
                    <UploadFile/> Mint an NFT Data Token
                </Typography>
                <TextField
                    key="txtOrganization"
                    id="txtOrganization"
                    name="organization"
                    label="Organization"
                    defaultValue="Org1"
                    helperText="Organization name"
                    variant="standard"
                    required={true}
                />
                <TextField
                    id="txtOwner"
                    name="owner"
                    label="Owner"
                    defaultValue="minter"
                    helperText="Name of the owner (previously registered in the ledger)"
                    variant="standard"
                    required={true}
                />
                <FormControl fullWidth required={true}>
                    <InputLabel id="lblFileFormat">File Format</InputLabel>
                    <Select
                        labelId="lblFileFormat"
                        id="txtFileFormat"
                        name="fileFormat"
                        defaultValue={'txt'}
                        label="File Type"
                    >
                        <MenuItem key="FormatTxt" value={"txt"}>Text</MenuItem>
                        <MenuItem key="FormatImage" value={"image"}>Image</MenuItem>
                        <MenuItem key="FormatFolder" value={"folder"}>Folder</MenuItem>
                        <MenuItem key="FormatBin" value={"bin"}>Other binary</MenuItem>
                    </Select>
                </FormControl>
                <Stack direction="row" alignItems="baseline">
                    {/* <Input inputProps={ariaLabel} value={file.name} placeholder="Click to select a file" readOnly={true} /> */}
                    <label className="custom-file-upload">
                        <input type="file" name="file" multiple onChange={(e: any) => { handleFileClick(e) }}/>
                        <Typography color='white'>...</Typography>
                    </label>
                    <Typography>{fileName}</Typography>
                </Stack>
                <Button type="submit" variant="contained">Submit</Button>
                <NFTCard nftToken={nftToken}/>
            </Stack >
        </Box>
    )
}
