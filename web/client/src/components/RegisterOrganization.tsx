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
import CorporateFare from '@mui/icons-material/CorporateFare';

export default function RegisterOrganization() {
    const [fileName, setFileName] = React.useState<string>();
    const { loading, setLoading, error, setError, onMintToken, openRegisterOrganization, setOpenRegisterOrganization } = React.useContext(ClientContext) as ClientContextType
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        color: 'white',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const handleFileClick = (e: React.SyntheticEvent) => {
        const inputFile: any = e.target as any;
        if (inputFile && inputFile.files) {
            const files = inputFile.files as FileList
            setFileName(files[0].name)
        }
    }
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
            axios.post("http://localhost:3556/admin/register", nftContent)
                .then((response) => {
                    console.log(response);
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
        <Box sx={style}>
            <Stack
                direction="column"
                component="form"
                spacing={3}
                onSubmit={(e: React.SyntheticEvent) => { handleSubmission(e) }}>
                <Typography variant='h4'>
                    <CorporateFare /> Register organization
                </Typography>
                <Typography>
                    Use a connection profile file to register an organization <br />
                    Select the '.json' file of the organization you want to register. <br />
                    File is normally located in path: 'network/organizations/peerOrganizations/org[organization number].example.com'/connection-org1.json
                </Typography>
                <Stack direction="row" alignItems="baseline">
                    <label className="custom-file-upload">
                        <input type="file" name="file" multiple={false} onChange={(e: any) => { handleFileClick(e) }} />
                        <Typography color='white'>
                            Select file...
                        </Typography>
                    </label>
                    <Typography> </Typography>
                    <Typography>{fileName}</Typography>
                </Stack>
                <Button type="submit" variant="contained">Submit</Button>
            </Stack >
        </Box>
    )
}
