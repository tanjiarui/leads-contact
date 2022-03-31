import { Container, Paper, useMediaQuery } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import React from "react";

const useStyles = makeStyles(theme => ({
    pageContainer: {
        background: theme.palette.common.white,
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            marginTop: 0,
            paddingTop: theme.spacing(5)
        },
        overflow: "hidden"
    }
}));

export const Page = ({ children, maxWidth }) => {
    const theme = useTheme();
    const classes = useStyles();
    const matchesSM = useMediaQuery(theme.breakpoints.down('md'));
    return (<>
        <Paper
            className={classes.pageContainer}
            elevation={matchesSM ? 0 : 3}
            variant="elevation"
            style={{ maxWidth: theme.breakpoints.values[maxWidth || "md"] }}
            component={Container}>
            {children}
        </Paper>
    </>);
};