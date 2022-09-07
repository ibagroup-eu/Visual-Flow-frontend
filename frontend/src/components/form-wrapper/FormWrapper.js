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
import { Create } from '@material-ui/icons';
import {
    IconButton,
    CardHeader,
    Card,
    Avatar,
    Button,
    CardActions,
    CardContent
} from '@material-ui/core';

import { useTranslation } from 'react-i18next';
import useStyles from './FormWrapper.Style';

const FormWrapper = ({
    title,
    children,
    editMode,
    setEditMode,
    onSubmit,
    onCancel,
    isSaveBtnDisabled,
    editable
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Card>
            <CardHeader
                title={t(`main:form.header.${title}`)}
                className={classes.header}
                action={
                    !editMode &&
                    editable && (
                        <Avatar className={classes.icon} onClick={setEditMode}>
                            <IconButton>
                                <Create color="primary" />
                            </IconButton>
                        </Avatar>
                    )
                }
            />
            <CardContent className={classes.paddedTop}>{children}</CardContent>
            <CardActions
                className={classNames(
                    { [classes.hidden]: !editMode },
                    classes.buttonsGroup
                )}
            >
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    disabled={isSaveBtnDisabled()}
                >
                    {t('main:button.Save')}
                </Button>
                <Button
                    className={classNames(classes.button, classes.cancelBtn)}
                    variant="contained"
                    onClick={onCancel}
                >
                    {t('main:button.Cancel')}
                </Button>
            </CardActions>
        </Card>
    );
};

FormWrapper.propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
    editMode: PropTypes.bool,
    editable: PropTypes.bool,
    setEditMode: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    isSaveBtnDisabled: PropTypes.func
};

export default FormWrapper;
