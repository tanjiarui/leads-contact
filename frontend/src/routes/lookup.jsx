import React from 'react';
import { Button, FormControl, Input, Typography, CircularProgress, FormGroup, TextField, alpha, Grid } from '@mui/material';
import { Page } from "../components/page";
import api from '../lib/api';
import { makeStyles, useTheme } from '@mui/styles';
import { useProcess } from '../lib/hooks';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ContactForm from '../components/contactForm';
import { Cancel, Delete, Edit, PhotoCamera } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
    img: {
        width: "100%"
    }
}))

const Contact = ({ contact, onUpdated, onDeleted }) => {
    console.log(contact)
    const [mode, setMode] = React.useState('view')
    const switchMode = () => {
        setMode(m => m === "view" ? "edit" : "view")
    }

    const onDelete = async () => {
        await api.Contact().delete(contact.id)
            .then(() => onDeleted(contact.id))
            .catch(console.log)
    }

    const theme = useTheme();
    const headerText = mode === "view" ? "Contact Info" : "Edit Contact";
    return (
        <Paper component="div" sx={{
            p: 2,
            boxShadow: `0px 3px 1px -2px ${theme.palette.primary.light}, 0px 2px 2px 0px ${theme.palette.primary.light}, 0px 1px 5px 0px ${theme.palette.primary.light}`
        }}
        >
            <Grid container direction={"row"}>
                <Grid item xs>
                    <Typography variant="h6" component="h6" display="block" gutterBottom>{headerText}</Typography>
                </Grid>
                <Grid item xs="auto">
                    <IconButton component="span" onClick={switchMode}>
                        {mode === "edit" ? <Cancel />: <Edit />}
                    </IconButton>
                </Grid>
                <Grid item xs="auto">
                    <IconButton color="error" component="span" onClick={onDelete}>
                        <Delete />
                    </IconButton>
                </Grid>
            </Grid>
            {
                mode === "edit" ?
                    <ContactForm
                        initialValues={{ ...contact, name: contact.username }}
                        btnText={"Update"}
                        onSubmit={(v) => api.Contact().update(contact.id, v)}
                        onSuccess={(r) => {
                            setMode("view")
                            onUpdated(contact.id, r.Attributes)
                        }}
                    /> :
                    <div>{contact.username}</div>
            }
        </Paper>
    );
}

function LookupRoute() {
    const [query, setQuery] = React.useState("")
    const [contacts, setContacts] = React.useState([])
    const onSubmitQuery = async (e) => {
        e.preventDefault()
        api.Contact().find(query)
            .then(r => { console.log(r); return r })
            .then(r => Array.isArray(r.data) ? r.data : [])
            .then(setContacts)
            .catch(console.log)
    }
    const onUpdated = React.useCallback((id, contact) => {
        setContacts(cs => cs.map(c => c.id === id ? { ...contact, id: c.id } : c))
    }, [])

    const onDeleted = React.useCallback((id) => {
        setContacts(cs => cs.filter(c => c.id !== id))
    }, [])

    const classes = useStyles()
    const theme = useTheme()
    return (
        <Page>
            <Typography variant="h6" component="h6" display="block" gutterBottom>Search Contacts</Typography>
            <Paper
                component="form"
                sx={{ p: theme.spacing(0, 1), display: 'flex', alignItems: 'center', backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
                onSubmit={onSubmitQuery}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" onClick={onSubmitQuery}>
                    <SearchIcon />
                </IconButton>
            </Paper>
            {contacts.length === 0 ? <></> : <Divider sx={{ mt: 2, mb: 2 }} />}
            {
                contacts.map(c =>
                    <Contact key={c.id} contact={c} onUpdated={onUpdated} onDeleted={onDeleted}/>
                )
            }
        </Page>
    );
}

export default LookupRoute;