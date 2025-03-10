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
import moment from 'moment';
import { Box, Grid, Typography, Checkbox } from '@material-ui/core';
import TransformOutlinedIcon from '@material-ui/icons/TransformOutlined';
import Timeline from '@material-ui/icons/Timeline';
import classNames from 'classnames';
import { noop } from 'lodash';
import useStyles from './ImportModal.Styles';
import { DATE_FORMAT } from '../../../globalConstants';

const ModalGridRow = ({
    disabled,
    id,
    t,
    isItemSelected,
    handleSelect,
    labelId,
    kind,
    metadata
}) => {
    const classes = useStyles();
    const formatDate = date => date && moment(date, DATE_FORMAT).format(DATE_FORMAT);

    const renderIconType = type => {
        switch (type) {
            case 'ConfigMap':
                return <TransformOutlinedIcon className={classes.secondary} />;
            case 'WorkflowTemplate':
                return <Timeline className={classes.secondary} />;
            default:
                return null;
        }
    };

    return (
        <Box
            boxShadow={3}
            className={classNames(classes.row, isItemSelected && classes.linear)}
        >
            <Grid
                container
                alignItems="center"
                onClick={disabled ? noop : () => handleSelect(id, !isItemSelected)}
            >
                <Grid item xs={1} sm={1} md={1}>
                    <Checkbox
                        disabled={disabled}
                        checked={isItemSelected}
                        inputProps={{
                            'aria-labelledby': labelId
                        }}
                    />
                </Grid>
                <Grid item xs={2} sm={2} md={2} className={classes.center}>
                    {renderIconType(kind)}
                    <Typography color="textSecondary">
                        {t(`main:importPage.configType.${kind}`)}
                    </Typography>
                </Grid>
                <Grid item xs={9} sm={9} md={9} className={classes.paddingLeft}>
                    <Typography
                        variant="h5"
                        color="textSecondary"
                        className={classes.truncate}
                    >
                        {metadata?.name}
                    </Typography>
                    <Typography
                        component="div"
                        variant="body2"
                        className={classes.hint}
                    >
                        {t('main:importPage.LastUpdated')}:{' '}
                        {formatDate(metadata?.lastModified) || t('main:N/A')}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

ModalGridRow.propTypes = {
    t: PropTypes.func,
    id: PropTypes.array,
    isItemSelected: PropTypes.bool,
    handleSelect: PropTypes.func,
    labelId: PropTypes.string,
    kind: PropTypes.string,
    metadata: PropTypes.object,
    disabled: PropTypes.bool
};

export default ModalGridRow;
