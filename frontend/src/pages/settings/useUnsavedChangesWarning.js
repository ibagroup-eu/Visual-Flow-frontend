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

import React, { useState } from 'react';
import { Prompt } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import history from '../../utils/history';

const useUnsavedChangesWarning = () => {
    const { t } = useTranslation();
    const [isDirty, setDirty] = useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [lastLocation, setLastLocation] = useState(false);
    const [confirmedNavigation, setConfirmedNavigation] = useState(false);

    React.useEffect(() => {
        history.push(lastLocation.pathname);
    }, [confirmedNavigation]);

    const showModal = location => {
        if (
            !window.location.pathname.includes(location.pathname) ||
            location.pathname === '/'
        ) {
            setModalVisible(true);
            setLastLocation(location);
        }
    };

    const closeModal = callback => {
        setModalVisible(false);
        if (typeof callback === 'function') {
            callback();
        }
    };

    const handleBlockedNavigation = nextLocation => {
        if (!confirmedNavigation) {
            showModal(nextLocation);
            return false;
        }
        return true;
    };

    const handleConfirmNavigationClick = () =>
        closeModal(() => {
            if (lastLocation) {
                setConfirmedNavigation(true);
            }
        });

    const routerPrompt = (
        <>
            <Prompt when={isDirty} message={handleBlockedNavigation} />
            <Dialog
                open={modalVisible}
                onClose={closeModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('main:confirm.unsaved')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal} color="primary">
                        No
                    </Button>
                    <Button
                        onClick={handleConfirmNavigationClick}
                        color="primary"
                        autoFocus
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );

    return [routerPrompt, () => setDirty(true), () => setDirty(false)];
};

export default useUnsavedChangesWarning;
