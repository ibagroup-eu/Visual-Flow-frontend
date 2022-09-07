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
import DeveloperModeOutlinedIcon from '@material-ui/icons/DeveloperModeOutlined';
import StorageOutlinedIcon from '@material-ui/icons/StorageOutlined';
import React from 'react';
import join16 from '../../../assets/join16.svg';
import union16 from '../../../assets/union16.svg';
import cdc16 from '../../../assets/cdc16.svg';
import removeDuplicates16 from '../../../assets/removeDuplicates16.svg';
import filter16 from '../../../assets/filter16.svg';
import transform16 from '../../../assets/transform16.svg';
import sort16 from '../../../assets/sort16.svg';
import {
    READ,
    WRITE,
    UNION,
    GROUP,
    REMOVE_DUPLICATES,
    JOIN,
    CDC,
    TRANSFORM,
    FILTER,
    JOB,
    NOTIFICATION,
    PIPELINE,
    CONTAINER,
    CACHE,
    SORT
} from '../../constants';

const style = {
    fontSize: '16px'
};

// eslint-disable-next-line complexity
const stageIcon = stageName => {
    switch (stageName) {
        case READ:
            return <DescriptionOutlinedIcon style={style} />;
        case WRITE:
            return <CreateIcon style={style} />;
        case GROUP:
            return <DynamicFeedIcon style={style} />;
        case REMOVE_DUPLICATES:
            return <img src={removeDuplicates16} alt="removeDuplicates" />;
        case FILTER:
            return <img src={filter16} alt="filter" />;
        case TRANSFORM:
            return <img src={transform16} alt="transform" />;
        case JOIN:
            return <img src={join16} alt="join" />;
        case CDC:
            return <img src={cdc16} alt="cdc" />;
        case UNION:
            return <img src={union16} alt="union" />;
        case JOB:
            return <TransformOutlinedIcon style={style} />;
        case PIPELINE:
            return <TimelineOutlinedIcon style={style} />;
        case NOTIFICATION:
            return <MailOutlinedIcon style={style} />;
        case CONTAINER:
            return <DeveloperModeOutlinedIcon style={style} />;
        case CACHE:
            return <StorageOutlinedIcon style={style} />;
        case SORT:
            return <img src={sort16} alt="sort" />;
        default:
            return <></>;
    }
};

export default stageIcon;
