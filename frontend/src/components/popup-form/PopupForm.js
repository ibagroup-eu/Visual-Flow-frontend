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
import { Card, CardContent, CardHeader, IconButton, Modal } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import classNames from 'classnames';

import useStyles from './PopupForm.Styles';

const PopupForm = ({
    display,
    title,
    children,
    onClose,
    isNotHelper,
    logs,
    minWidthClass
}) => {
    const classes = useStyles();

    return (
        <Modal
            open={display}
            onClose={onClose}
            className={classNames(classes.root, classes[minWidthClass])}
            styles={logs && 'minWidth: 60%'}
        >
            <Card className={classes.card}>
                <CardHeader
                    title={title}
                    className={classes.header}
                    action={
                        !isNotHelper && (
                            <IconButton aria-label="settings" onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        )
                    }
                />
                <CardContent className={classes.content}>{children}</CardContent>
            </Card>
        </Modal>
    );
};

PopupForm.propTypes = {
    logs: PropTypes.bool,
    children: PropTypes.any,
    title: PropTypes.string,
    display: PropTypes.bool,
    isNotHelper: PropTypes.bool,
    onClose: PropTypes.func,
    minWidthClass: PropTypes.string
};

export default PopupForm;
