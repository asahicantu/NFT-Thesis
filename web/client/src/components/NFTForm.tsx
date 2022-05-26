import React from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from "axios";
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { ClientContext } from '../context/clientContext';
import { ClientContextType } from '../@types/clientContextType';
import Box from '@mui/material/Box';


export default function NFTForm() {
    const { loading, setLoading } = React.useContext(ClientContext) as ClientContextType
    const ariaLabel = { 'aria-label': 'File name' };
    const [nftToken, setNftToken] = React.useState<any>();

    const handleSubmission = (e: React.SyntheticEvent) => {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            organization: { value: string }
            owner: { value: string }
            fileFormat: { value: string }
            fileName: { value: string }
            file: { naame: string, files: any }
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
                FileName: target.fileName.value
            },
        };

        var newFiles = target.file.files;
        var filesArr = Array.prototype.slice.call(newFiles);
        const fl = filesArr[0] as File;
        var reader = new FileReader();
        reader.onload = function (e: any) {
            nftContent.data = e.target.result;
            console.log(nftContent);
            axios.post("http://localhost:3556/api/v1/nft/mint", nftContent)
                .then((response) => {
                    console.log(response);
                    setNftToken(response.data);
                }
                ).catch((reason: any) => {
                    console.log(reason);
                });
        };
        reader.onerror = function (e) {
            // error occurred
            console.log('Error : ' + e.type);
        };
        reader.readAsBinaryString(fl);
    }
    return (
        <Box>
            <Stack
                direction="column"
                component="form"
                spacing={3}
                onSubmit={(e: React.SyntheticEvent) => { handleSubmission(e) }}>
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
                        <input type="file" name="file" multiple />
                        ...
                    </label>
                </Stack>
                <Button type="submit" variant="contained">Submit</Button>
            </Stack >
        </Box>
    )
}
