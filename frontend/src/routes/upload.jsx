import { PhotoCamera } from '@mui/icons-material';
import { Button, FormControl, Input, Typography, CircularProgress, FormGroup, TextField, Divider } from '@mui/material';
import React from 'react';
import { Page } from "../components/page";
import api from '../lib/api';
import { makeStyles, useTheme } from '@mui/styles';
import { useProcess } from '../lib/hooks';
import { useNavigate, useOutletContext } from 'react-router-dom';
import ContactForm from '../components/contactForm';

const useStyles = makeStyles((theme) => ({
    img: {
        width: "100%"
    }
}))

function UploadRoute() {

    const [imageInfo, setImageInfo] = React.useState(null)
    const [file, setFile] = React.useState(null)
    const [form, setForm] = React.useState(null)
    const [upload, processing] = useProcess(a => api.Image().upload(a))
    const [detect] = useProcess(a => api.Image().detect(a))
    const handleChange = (e) => {
        setImageInfo(null)
        setForm(null)
        setFile(e.target.files[0] || null)
    }

    React.useEffect(async () => {
        if (file) {
            setFile(null)
            const converter = new Promise(function (resolve, reject) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(
                    reader.result.toString().replace(/^data:(.*,)?/, '')
                );
                reader.onerror = (error) => reject(error);
            });
            const encodedString = await converter;
            await upload({ filename: file.name, filebytes: encodedString })
                .then(r => setImageInfo(r.data))
                .catch(console.log)
        }
    }, [file])

    React.useEffect(async () => {
        if (imageInfo) {
            await detect(imageInfo.fileId)
                .then(r => setForm(r.data))
                .catch(console.log)
        }
    }, [imageInfo]);

    const [state,setState] = useOutletContext();
    const navigate = useNavigate();

    const handleSuccess = (r) => {
        setState((s) => ({...s, accessId: r.access_id}))
        return navigate("/");
    }
    
    const theme = useTheme()
    const classes = useStyles()

    return (
        <Page>
            <Typography variant="h6" component="h6" display="block" gutterBottom>Create Lead Contact</Typography>
            <FormControl>
                <label htmlFor="upload-contact">
                    <Input style={{ display: "none" }} accept="image/*" id="upload-contact" value={''} type="file" onChange={handleChange} />
                    <Button disabled={processing} variant="contained" component="span" startIcon={<PhotoCamera />}>
                        Upload
                    </Button>
                </label>
            </FormControl>
            {
                imageInfo &&
                <>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                    <img className={classes.img} src={imageInfo.fileUrl} />
                </>
            }
            {
                imageInfo && form &&
                <>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                    <ContactForm
                        initialValues={form}
                        btnText={"Create"}
                        onSubmit={(v) => api.Contact().create(imageInfo.fileId, v)}
                        onSuccess={handleSuccess}
                        onError={console.log}
                    />
                </>
            }
        </Page>
    );
}

export default UploadRoute;