import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import UploadRoute from "./routes/upload";
import LookupRoute from "./routes/lookup";
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material';
import { Page } from './components/page';

const theme = createTheme({
    // palette: {
    //     primary: {
    //         main: "#ff7043",
    //         light: "#ffa270",
    //         dark: "#c63f17"
    //     },
    //     secondary: {
    //         main: "#aeea00",
    //         light: "#e4ff54",
    //         dark: "#79b700"
    //     },
    // },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                html: {
                    WebkitFontSmoothing: 'auto',
                },
                body: {
                    margin: 0
                },
                img: {
                    verticalAlign: "middle"
                },
                svg: {
                    verticalAlign: "middle"
                }
            },
        },
    },
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="" element={<LookupRoute />} />
            <Route path="upload" element={<UploadRoute />} />
            <Route
              path="*"
              element={
                <Page>
                  <p>There's nothing here!</p>
                </Page>
              }
            />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
