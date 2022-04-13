import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Outlet, useNavigate } from 'react-router-dom';
import { alpha, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.common.white
    },
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  fixedTopBar: {
    position: "fixed",
    display: "block",
    width: "100%",
    zIndex: 1000
  },
  pageBox: {
    marginTop: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(8)
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(9)
    }
  },
  snack: {
    marginTop: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(8)
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(9)
    }
  }
}))

const pages = [
  {
    title: "Lookup",
    url: "/"
  },
  {
    title: "Upload",
    url: "/upload"
  }
];

const Alert = React.forwardRef(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const context = React.useState({
    accessId: null,
    message: null,
  })
  const [state, setState] = context;
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const classes = useStyles()
  const navigate = useNavigate();
  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClickMenu = (url) => {
    handleCloseNavMenu()
    navigate(url)
  };

  const handleSnackClose = () => {
    setState(s => ({ ...s, message: null }))
  }

  return (
    <main className={classes.body} >
      <AppBar className={classes.fixedTopBar}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              Leads Contact
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.title} onClick={() => handleClickMenu(page.url)}>
                    <Typography textAlign="center">{page.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            >
              Leads Contact
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.title}
                  onClick={() => handleClickMenu(page.url)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box className={classes.pageBox}>
        <Outlet context={context} />
        <Snackbar
          className={classes.snack}
          autoHideDuration={3000}
          onClose={handleSnackClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={Boolean(state.message)}
          key="mainsnack"
        >
          <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
            {state.message || ''}
          </Alert>
        </Snackbar>
      </Box>
    </main>
  );
}

export default App;
