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
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    Typography
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import LockOutlined from '@material-ui/icons/LockOutlined';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useStyles from './ProjectCard.Styles';
import { deleteProject } from '../../redux/actions/projectsActions';
import toggleConfirmationWindow from '../../redux/actions/modalsActions';

export const ProjectCardSkeleton = () => {
    const classes = useStyles();
    return <Skeleton variant="rect" className={classes.skeleton} />;
};

export const ProjectCard = ({
    project: { id, name, locked } = {},
    onClick,
    superUser,
    remove,
    confirmationWindow
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const onCardClickAction = locked ? null : onClick;

    return (
        <Card className={classes.root}>
            <CardHeader
                action={
                    <>
                        {id && superUser && (
                            <IconButton
                                aria-label="Remove project"
                                onClick={() =>
                                    confirmationWindow({
                                        body: `${t('main:confirm.sure')} '${name}'?`,
                                        callback: () => remove(id)
                                    })
                                }
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                        {locked && !superUser && (
                            <IconButton aria-label="Locked project">
                                <LockOutlined />
                            </IconButton>
                        )}
                    </>
                }
                className={classes.header}
            />
            <CardActionArea onClick={onCardClickAction} className={classes.content}>
                <CardContent className={classes.content}>
                    {!id ? (
                        <AddIcon fontSize="large" color="action" />
                    ) : (
                        <Typography
                            variant="h5"
                            component="h5"
                            color="textSecondary"
                        >
                            {name}
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
ProjectCard.propTypes = {
    project: PropTypes.object,
    onClick: PropTypes.func,
    remove: PropTypes.func,
    superUser: PropTypes.bool,
    confirmationWindow: PropTypes.func.isRequired
};

const mapDispatchToProps = {
    remove: deleteProject,
    confirmationWindow: toggleConfirmationWindow
};

export default connect(null, mapDispatchToProps)(ProjectCard);
