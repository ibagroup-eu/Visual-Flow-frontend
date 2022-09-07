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

import { Grid } from '@material-ui/core';
import SkipPreviousOutlinedIcon from '@material-ui/icons/SkipPreviousOutlined';
import SkipNextOutlinedIcon from '@material-ui/icons/SkipNextOutlined';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import OverviewContainer from '../container';
import IconCard from '../../../components/icon-card';
import UtilizationItem from './UtilizationItem';
import useStyles from './Utilization.Styles';
import { TextSkeleton } from '../../../components/skeleton';

const Utilization = ({ data, loading }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const items = [
        {
            title: t('main:overview.utilization.Used'),
            Icon: PlayArrowOutlinedIcon,
            data: data?.used,
            sizing: true
        },
        {
            title: t('main:overview.utilization.Requested'),
            Icon: SkipPreviousOutlinedIcon,
            data: data?.requested,
            sizing: true
        },
        {
            title: t('main:overview.utilization.Limits'),
            Icon: SkipNextOutlinedIcon,
            data: data?.limits,
            sizing: true
        }
    ];

    return (
        <OverviewContainer loading={loading} title={t('main:overview.Utilization')}>
            {items.map(item => (
                <Grid key={item.title} item xs={12} md={4} className={classes.item}>
                    <IconCard loading={loading} {...item}>
                        {loading ? (
                            <TextSkeleton />
                        ) : (
                            <UtilizationItem {...item.data} />
                        )}
                    </IconCard>
                </Grid>
            ))}
        </OverviewContainer>
    );
};

Utilization.propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool
};

export default Utilization;
