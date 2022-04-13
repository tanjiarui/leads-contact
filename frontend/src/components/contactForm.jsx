import { Button, FormGroup, TextField } from '@mui/material';
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

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
});


const ContactForm = ({ initialValues, onSubmit ,onSuccess, onError, btnText }) => {

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
            await onSubmit(values)
                .then(
                    r => {
                        console.log(r)
                        onSuccess(r.data)
                    },
                    onError
                );
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
                    {btnText}
                </Button>
            </FormGroup>
        </form>
    );
}

export default ContactForm;