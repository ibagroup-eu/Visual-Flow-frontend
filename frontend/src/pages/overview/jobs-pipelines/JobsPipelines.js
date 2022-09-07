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
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

import IconCard from '../../../components/icon-card';
import JobsPipelinesItem from './JobsPipelinesItem';
import useStyles from './JobsPipelines.Styles';
import OverviewContainer from '../container';
import { TextSkeleton } from '../../../components/skeleton';
import history from '../../../utils/history';

const JobsPipelines = ({ items, loading, title, setStatus, setCurrentPage }) => {
    const classes = useStyles();

    const handleGridClick = status => {
        setStatus(status);
        setCurrentPage(0);
        history.push(`${title.toLowerCase()}`);
    };

    return (
        <OverviewContainer title={title}>
            {items.map(item => (
                <Grid
                    key={item.title}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    className={classes.item}
                >
                    <div
                        className={classes.subItem}
                        onClick={() => handleGridClick(item.title)}
                    >
                        <IconCard {...item}>
                            {loading ? (
                                <TextSkeleton />
                            ) : (
                                <JobsPipelinesItem value={item.data} />
                            )}
                        </IconCard>
                    </div>
                </Grid>
            ))}
        </OverviewContainer>
    );
};

JobsPipelines.propTypes = {
    items: PropTypes.array,
    loading: PropTypes.bool,
    title: PropTypes.string,
    setStatus: PropTypes.func,
    setCurrentPage: PropTypes.func
};

export default JobsPipelines;
