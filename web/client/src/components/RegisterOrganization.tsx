import React from 'react'
import { Box, Button,  Typography } from '@mui/material'
import { ClientContextType, LogMessage } from '../@types/clientContextType'
import Stack from '@mui/material/Stack'
import { ClientContext } from '../context/clientContext'
import axios, { AxiosRequestConfig } from "axios";
import style from '../@types/panelStyle'
import CorporateFare from '@mui/icons-material/CorporateFare'

export default function RegisterOrganization() {
    const [fileName, setFileName] = React.useState<string>();
    const { LogMessage, setLoading} = React.useContext(ClientContext) as ClientContextType

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
            file: { naame: string, files: any }
        }
        const files = target.file.files as FileList
        const fl = files[0] as File;
        var reader = new FileReader();
        const config : AxiosRequestConfig = {
            maxBodyLength: Number(process.env.REACT_APP_MAX_FILE_SIZE),
            maxContentLength: Number(process.env.REACT_APP_MAX_FILE_SIZE),
            baseURL: process.env.REACT_APP_BASE_URL as string,
            headers: {
                'Accept':'*/*',
                'Content-type': 'application/json',
            }
        }
        reader.onload = function (e: any) {
            setLoading(true)
            axios.post(
                'admin/register',
                e.target.result,
                config
            )
            .then((response) => {
                LogMessage(response.data, 'success')
            }
            ).catch((reason: any) => {
                LogMessage(reason, 'error')
            }).finally(() => {
                setLoading(false)
            });
        };
        reader.onerror = function (e) {
            // error occurred
            LogMessage(e.type, 'error')
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
                        <Typography color='white'>...</Typography>
                    </label>
                    <Typography>{fileName}</Typography>
                </Stack>
                <Button type="submit" variant="contained">Submit</Button>
            </Stack >
        </Box>
    )
}
