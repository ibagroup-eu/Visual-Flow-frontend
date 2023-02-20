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
import { Button, CircularProgress, withStyles } from '@material-ui/core';

import styles from './ParametersPanelButtons.Styles';

export const ParametersPanelButtons = ({
    save,
    cancel,
    saving,
    disabled,
    classes
}) => {
    const { t } = useTranslation();

    return (
        <div className={classes.buttons}>
            <Button
                onClick={save}
                size="large"
                variant="contained"
                color="primary"
                disabled={disabled}
                className={classes.button}
            >
                {t('main:button.Save')}
                {saving && (
                    <CircularProgress className={classes.buttonProgress} size={25} />
                )}
            </Button>
            <Button
                onClick={cancel}
                size="large"
                variant="contained"
                disabled={saving}
                className={classNames(classes.button, classes.cancelBtn)}
            >
                {t('main:button.Cancel')}
            </Button>
        </div>
    );
};

ParametersPanelButtons.propTypes = {
    save: PropTypes.func,
    cancel: PropTypes.func,
    classes: PropTypes.object,
    saving: PropTypes.bool,
    disabled: PropTypes.bool
};

export default withStyles(styles)(ParametersPanelButtons);
