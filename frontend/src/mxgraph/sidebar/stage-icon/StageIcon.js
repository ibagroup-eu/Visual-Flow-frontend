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

import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import CreateIcon from '@material-ui/icons/Create';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import TransformOutlinedIcon from '@material-ui/icons/TransformOutlined';
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import MailOutlinedIcon from '@material-ui/icons/MailOutlined';
import StorageOutlinedIcon from '@material-ui/icons/StorageOutlined';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import PlaylistAddCheckSharpIcon from '@material-ui/icons/PlaylistAddCheckSharp';
import SettingsEthernetOutlinedIcon from '@material-ui/icons/SettingsEthernetOutlined';
import {
    CachedOutlined,
    CheckCircleOutlined,
    InboxOutlined,
    WrapText,
    ScheduleOutlined
} from '@material-ui/icons';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import React from 'react';
import SortOutlinedIcon from '@material-ui/icons/SortOutlined';
import PropTypes from 'prop-types';
import useStyles from './StageIcon.Styles';

import {
    CACHE,
    CDC,
    CONTAINER,
    FILTER,
    GROUP,
    JOB,
    JOIN,
    NOTIFICATION,
    WAIT,
    PIPELINE,
    READ,
    REMOVE_DUPLICATES,
    SLICE,
    SORT,
    TRANSFORM,
    UNION,
    WRITE,
    PIVOT,
    STRING,
    VALIDATE,
    DATETIME,
    WITH_COLUMN,
    HANDLE_NULL,
    AI_TEXT_TASK
} from '../../constants';

import {
    ChangeDataCapture,
    Filter,
    Join,
    RemoveDuplicates,
    Transform,
    Union
} from '../../../components/icons';

const icons = {
    [READ]: DescriptionOutlinedIcon,
    [WRITE]: CreateIcon,
    [GROUP]: DynamicFeedIcon,
    [REMOVE_DUPLICATES]: RemoveDuplicates,
    [FILTER]: Filter,
    [TRANSFORM]: Transform,
    [JOIN]: Join,
    [CDC]: ChangeDataCapture,
    [UNION]: Union,
    [JOB]: TransformOutlinedIcon,
    [PIPELINE]: TimelineOutlinedIcon,
    [NOTIFICATION]: MailOutlinedIcon,
    [WAIT]: ScheduleOutlined,
    [CONTAINER]: InboxOutlined,
    [CACHE]: StorageOutlinedIcon,
    [SORT]: SortOutlinedIcon,
    [SLICE]: DeleteSweepIcon,
    [STRING]: WrapText,
    [VALIDATE]: CheckCircleOutlined,
    [DATETIME]: ScheduleOutlined,
    [WITH_COLUMN]: ViewWeekIcon,
    [PIVOT]: CachedOutlined,
    [HANDLE_NULL]: PlaylistAddCheckSharpIcon,
    [AI_TEXT_TASK]: SettingsEthernetOutlinedIcon
};

const StageIcon = ({ stageName }) => {
    const classes = useStyles();

    const Component = icons[stageName];

    if (Component != null) {
        return <Component className={classes.icon} />;
    }
    return <></>;
};

StageIcon.propTypes = {
    stageName: PropTypes.string.isRequired
};

export default StageIcon;
