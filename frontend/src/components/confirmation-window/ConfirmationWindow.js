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
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import toggleConfirmationWindow from '../../redux/actions/modalsActions';

export const ConfirmationWindow = ({ id, modals, toggle }) => {
    const { t } = useTranslation();
    const modalProps = modals[id] || {};
    const {
        open = false,
        callback = noop,
        title = t('main:confirm.title'),
        body = t('main:confirm.body'),
        ok = t('main:confirm.Yes'),
        cancel = t('main:confirm.No')
    } = modalProps;

    const handleClose = () => toggle({ id });

    const handleSubmit = () => {
        callback();
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{body}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    {cancel}
                </Button>
                <Button onClick={handleSubmit} color="secondary" autoFocus>
                    {ok}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
ConfirmationWindow.propTypes = {
    id: PropTypes.string.isRequired,
    toggle: PropTypes.func.isRequired,
    modals: PropTypes.object
};

ConfirmationWindow.defaultProps = {
    modals: {}
};

const mapStateToProps = state => ({
    modals: state.modals
});

const mapDispatchToProps = {
    toggle: toggleConfirmationWindow
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationWindow);
