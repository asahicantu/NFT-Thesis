import React from 'react'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { ClientContextType, LogMessage } from '../@types/clientContextType'
import Stack from '@mui/material/Stack'
import { ClientContext } from '../context/clientContext'
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { PersonAdd } from '@mui/icons-material'
import style from '../@types/panelStyle'
import User from '../../../common/user'

export default function EnrollUser() {
    const { LogMessage, setLoading } = React.useContext(ClientContext) as ClientContextType
    const [org, setOrg] = React.useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setOrg(event.target.value as string);
    };
    const handleSubmission = (e: React.SyntheticEvent) => {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            organization: { value: string }
            user: { value: string }
            affiliation: { value: string }
        }
        const userData :User = {
            name : target.user.value,
            organization : target.organization.value,
            //Concat organization with affiliation as this is a hyperledger requirement
            affilitation : target.organization.value + '.' +  target.affiliation.value
        }
        const config: AxiosRequestConfig = {
            baseURL: process.env.REACT_APP_BASE_URL as string,
            headers: {
                'Accept': '*/*',
                'Content-type': 'application/json',
            }
        }
        setLoading(true)
        axios.post('admin/enroll',userData,config
        )
        .then((response) => {
            LogMessage(response.data, 'success')
        }).catch((error: AxiosError) => {
            if (error && error.response && error.response.data) {
                console.log(error);
                const messageData = error.response.data as any
                LogMessage(messageData, 'error')
            }
            else{
                LogMessage(error,'error')
            }
        }).finally(() => {
            setLoading(false)
        });
    }
    return (
        <Box sx={style}>
            <Stack
                direction="column"
                component="form"
                spacing={3}
                onSubmit={(e: React.SyntheticEvent) => { handleSubmission(e) }}>
                <Typography variant='h4'>
                    <PersonAdd /> Enroll User
                </Typography>
                <Typography>
                    Enroll the users that will use the application
                </Typography>
                <Stack direction="column" alignItems="baseline" spacing={4}>

                    <FormControl fullWidth>
                        <InputLabel id="lblOrganization">Organization</InputLabel>
                        <Select
                            labelId="lblOrganization"
                            id="lstOrg"
                            name="organization"
                            value={org}
                            label="Organization"
                            onChange={handleChange}
                        >
                            <MenuItem value={'Org1'}>Organization 1</MenuItem>
                            <MenuItem value={'Org2'}>Organization 2</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField id="txtUser" name="user" label="User Name" variant="filled" />
                    <TextField id="txtAffiliation" name="affiliation" label="Affiliation" variant="filled" defaultValue="department1" />
                </Stack>
                <Button type="submit" variant="contained">Submit</Button>
            </Stack >
        </Box>
    )
}
