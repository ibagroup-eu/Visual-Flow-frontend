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

import {
    Grid,
    Typography,
    Checkbox,
    TableCell,
    withStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './PipelineTitleCell.Styles';
import TableTimeData from '../../../components/table-time-data';
import TagsList from '../../../components/tags-list';

const PipelineTitleCell = ({
    title,
    lastRun,
    lastFinished,
    lastEdit,
    checked,
    onClick,
    tags,
    resetTags,
    onCheckTags,
    checkedTags,
    classes
}) => {
    const titleCell = () => (
        <Grid item xs={10}>
            <Typography variant="h5" className={classes.title}>
                {title}
            </Typography>
            <Typography
                component="div"
                variant="body2"
                color="textSecondary"
                className={classes.subtitle}
            >
                <TableTimeData
                    lastEdit={lastEdit}
                    lastFinished={lastFinished}
                    lastRun={lastRun}
                />
            </Typography>
            <TagsList
                tags={tags || []}
                resetTags={resetTags}
                onCheckTags={onCheckTags}
                checkedTags={checkedTags}
            />
        </Grid>
    );
    return (
        <TableCell component="th" scope="row" className={classes.cell}>
            <Grid container spacing={1} className={classes.root}>
                <Grid item xs={1} classes={{ root: classes.checkbox }}>
                    <Checkbox checked={checked} onChange={onClick} />
                </Grid>
                {titleCell()}
            </Grid>
        </TableCell>
    );
};

PipelineTitleCell.propTypes = {
    title: PropTypes.string,
    lastRun: PropTypes.string,
    lastFinished: PropTypes.string,
    lastEdit: PropTypes.string,
    checked: PropTypes.bool,
    onClick: PropTypes.func,
    tags: PropTypes.array,
    classes: PropTypes.object,
    resetTags: PropTypes.func,
    onCheckTags: PropTypes.func,
    checkedTags: PropTypes.object
};

export default withStyles(styles, { name: 'PipelineTitleCell' })(PipelineTitleCell);
