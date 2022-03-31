import { PhotoCamera } from '@mui/icons-material';
import { Button, FormControl, Input, Typography, CircularProgress, FormGroup, TextField } from '@mui/material';
import React from 'react';
import { Page } from "../components/page";
import api from '../lib/api';
import { makeStyles } from '@mui/styles';
import { useProcess } from '../lib/hooks';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    img: {
        width: "100%"
    }
}))

const formSchema = yup.object({
    name: yup
        .string("Enter contact's name")
        .default('')
        .required("Contact's name is required"),
    email: yup
        .string("Enter contact's email")
        .default('')
        .email('Enter a valid email'),
    address: yup
        .string("Enter contact's address")
        .default('')
        .nullable(),
    phone: yup
        .string("Enter contact's phone")
        .default('')
        .nullable(),
    website: yup
        .string("Enter contact's website url")
        .default('')
        .url("Enter a valid website url")
});


const Form = ({ imageId, initialValues, onCreate }) => {

    const formik = useFormik({
        initialValues: {
            name: initialValues.name || "",
            email: initialValues.email || "",
            address: initialValues.address || "",
            phone: initialValues.phone || "",
            website: initialValues.website || "",
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            await api.Contact().create(imageId, values)
                .then(
                    r => onCreate(imageId, r.data),
                    r => {
                        console.log(r)
                        // formik.setErrors(r.data.errors)
                    });
            return true;
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <FormGroup>
                <TextField //name
                    id="outlined-name-input"
                    label="Name"
                    type="text"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={formik.values.name}
                    onChange={formik.handleChange("name")}
                    onBlur={formik.handleBlur("name")}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <TextField //email
                    id="outlined-email-input"
                    label="Email"
                    type="email"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={formik.values.email}
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField //address
                    id="outlined-address-input"
                    label="Address"
                    type="text"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={formik.values.address}
                    onChange={formik.handleChange("address")}
                    onBlur={formik.handleBlur("address")}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                />
                <TextField //phone
                    id="outlined-phone-input"
                    label="Phone"
                    type="phone"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={formik.values.phone}
                    onChange={formik.handleChange("phone")}
                    onBlur={formik.handleBlur("phone")}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                />
                <TextField //website
                    id="outlined-website-input"
                    label="Website"
                    type="text"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={formik.values.website}
                    onChange={formik.handleChange("website")}
                    onBlur={formik.handleBlur("website")}
                    error={formik.touched.website && Boolean(formik.errors.website)}
                    helperText={formik.touched.website && formik.errors.website}
                />
                <br />
                <Button
                    type="submit"
                    disabled={formik.isSubmitting}
                    onClick={formik.handleSubmit}
                    variant="contained"
                    color="primary"
                    fullWidth>
                    Create
                </Button>
            </FormGroup>
        </form>
    );
}

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
            console.log(imageInfo)
            await detect(imageInfo.fileId)
                .then(r => setForm(r.data))
                .catch(console.log)
        }
    }, [imageInfo])

    const navigate = useNavigate();
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
                    <hr />
                    <img className={classes.img} src={imageInfo.fileUrl} />
                </>
            }
            {
                imageInfo && form &&
                <>
                    <hr />
                    <Form imageId={imageInfo.fileId} initialValues={form} onCreate={() => navigate("/")} />
                </>
            }
        </Page>
    );
}

export default UploadRoute;