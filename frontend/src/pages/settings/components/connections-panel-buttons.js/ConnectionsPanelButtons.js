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
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, CircularProgress } from '@material-ui/core';

import useStyles from './ConnectionsPanelButtons.Styles';

const ConnectionsPanelButtons = ({
    saveConnection,
    saveIsDisabled,
    confirmCancel,
    pinging,
    pingConnection,
    pingIsDisabled,
    uploading
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <div className={classes.buttons}>
            <Button
                onClick={saveConnection}
                size="large"
                variant="contained"
                color="primary"
                disabled={saveIsDisabled || uploading}
                className={classes.button}
            >
                {t('main:button.Save')}
                {uploading && (
                    <CircularProgress className={classes.buttonProgress} size={25} />
                )}
            </Button>
            <Button
                onClick={confirmCancel}
                disabled={uploading}
                size="large"
                variant="contained"
                className={classNames(classes.button, classes.cancelBtn)}
            >
                {t('main:button.Cancel')}
            </Button>
            <Button
                onClick={pingConnection}
                size="large"
                variant="contained"
                color="primary"
                disabled={pingIsDisabled || pinging || uploading}
                className={classes.button}
            >
                {t('main:button.Ping')}
                {pinging && (
                    <CircularProgress className={classes.buttonProgress} size={25} />
                )}
            </Button>
        </div>
    );
};

ConnectionsPanelButtons.propTypes = {
    saveConnection: PropTypes.func,
    saveIsDisabled: PropTypes.bool,
    confirmCancel: PropTypes.func,
    pingConnection: PropTypes.func,
    pinging: PropTypes.bool,
    pingIsDisabled: PropTypes.bool,
    uploading: PropTypes.bool
};

export default ConnectionsPanelButtons;
