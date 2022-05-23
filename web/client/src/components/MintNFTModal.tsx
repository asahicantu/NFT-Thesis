import React, { ReactNode, Fragment } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import ReactDOM from 'react-dom'
import { ClientContextType } from '../@types/clientContextType'
import Modal from '@mui/material/Modal'
import moment from 'moment'
import {ClientContext} from '../context/clientContext'
import './MintNFTModal.css'
import Stack from '@mui/material/Stack'
import { Guid } from 'guid-typescript'
import { ClientContext } from '../context/clientContext'

export default function MintNFTModal() {
    const { openModal, setOpenModal, createTodo } = React.useContext(TodoContext) as TodoContextType
    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }
    const onSubmitTodo = (e: React.SyntheticEvent) => {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            text: { value: string };
            date: { value: string };
        }
        const text = target.text.value
        const date = target.date.value
        const todo: Todo =
        {
            id: Guid.create().toString(),
            text: text,
            dueDate: new Date(Date.parse(date)),
            completed: false
        }
        createTodo(todo)
        setOpenModal(false)
    }
    return (

        <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Stack className="modal-Background" sx={style} component="form" noValidate direction="column" spacing={1} onSubmit={(e: React.SyntheticEvent) => { e.preventDefault(); onSubmitTodo(e) }}>
                <TextField id="txtTaskName" name="text" label="Task Name" variant="standard" />
                {/* <TextField
                    id="txtTaskDate"
                    label="Date"
                    type="date"
                    defaultValue={moment(new Date()).format('dd-MM-yyyy')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                /> */}
                <Button variant="contained" name="date" type="submit">Create Task</Button>
            </Stack>
        </Modal>
    )
}
