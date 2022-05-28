import { Snackbar, Typography } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import React from 'react'
import { ClientContextType } from '../@types/clientContextType';
import { ClientContext } from '../context/clientContext';

export default function MessagePanel() {
    const { openSnackbar, setOpenSnackbar, snackbarMessage, snackbarType } = React.useContext(ClientContext) as ClientContextType
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    return (
        <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackbarType} sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
    )
}
