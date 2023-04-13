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
import {
    Backdrop,
    Card,
    CardContent,
    CardHeader,
    Fade,
    IconButton,
    Modal
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import classNames from 'classnames';
import useStyles from './PopupForm.Styles';

const PopupForm = ({
    display,
    title,
    children,
    onClose,
    isNotHelper,
    className
}) => {
    const classes = useStyles();

    return (
        <Modal
            open={display}
            onClose={onClose}
            className={classes.root}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <Fade in={display}>
                <Card className={classNames(classes.card, className)}>
                    <CardHeader
                        title={title}
                        className={classes.header}
                        action={
                            !isNotHelper && (
                                <IconButton
                                    className={classes.header}
                                    aria-label="settings"
                                    onClick={onClose}
                                >
                                    <CloseIcon />
                                </IconButton>
                            )
                        }
                    />
                    <CardContent className={classes.content}>{children}</CardContent>
                </Card>
            </Fade>
        </Modal>
    );
};

PopupForm.propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
    display: PropTypes.bool,
    isNotHelper: PropTypes.bool,
    onClose: PropTypes.func,
    className: PropTypes.string
};

export default PopupForm;
