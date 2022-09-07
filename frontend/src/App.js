/*
 * Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { Router, Redirect } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { ErrorOutlineRounded } from '@material-ui/icons';

import { store, synthHistory } from './redux';
import Routes from './routes';
import Header from './components/header';
import useStyles from './App.Styles';
import theme from './theme';
import Notifications from './components/notification';
import ConfirmationWindow from './components/confirmation-window';
import { GLOBAL_CONFIRMATION_ID } from './redux/actions/modalsActions';
import i18n from './i18n';

const App = () => {
    const classes = useStyles();

    return (
        <I18nextProvider i18n={i18n}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Provider store={store}>
                    <Router history={synthHistory}>
                        <Redirect
                            to={
                                synthHistory.location.pathname +
                                synthHistory.location.search
                            }
                        />
                        <div className={classes.root}>
                            <SnackbarProvider
                                maxSnack={10}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center'
                                }}
                                iconVariant={{
                                    error: <ErrorOutlineRounded />
                                }}
                            >
                                <Header />
                                <Notifications />
                                <main className={classes.content}>
                                    <div className={classes.offset} />
                                    <Routes />
                                </main>
                            </SnackbarProvider>
                        </div>
                        <ConfirmationWindow id={GLOBAL_CONFIRMATION_ID} />
                    </Router>
                </Provider>
            </MuiThemeProvider>
        </I18nextProvider>
    );
};

export default App;
