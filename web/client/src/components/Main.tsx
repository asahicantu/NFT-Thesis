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
import style from '../@types/panelStyle'
import MenuIcon from '@mui/icons-material/Menu';

export default function Main() {

    return (
        <Box sx={style}>
            <Typography>
                Welcome! Select an option from the top left menu [<MenuIcon/>]
            </Typography>
        </Box>
    )
}
