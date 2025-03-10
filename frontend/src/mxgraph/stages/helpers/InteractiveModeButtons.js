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

import { PlayCircleOutline, SubjectOutlined } from '@material-ui/icons';

import { INTERACTIVE_RUNNING } from '../../constants';

import useStyles from './InteractiveModeButtons.Styles';

const InteractiveModeButtons = ({
    stage: { id, isRunEnabled, isMetadataEnabled, status }
}) => {
    const classes = useStyles();

    return (
        status !== INTERACTIVE_RUNNING && (
            <>
                <SubjectOutlined
                    className={
                        isMetadataEnabled ? classes.icon : classes.iconDisabled
                    }
                    id={`view-metadata-${id}`}
                />
                <PlayCircleOutline
                    className={isRunEnabled ? classes.icon : classes.iconDisabled}
                    id={`run-stage-${id}`}
                    onClick={isRunEnabled}
                />
            </>
        )
    );
};

InteractiveModeButtons.propTypes = {
    stage: PropTypes.shape({
        id: PropTypes.string.isRequired,
        isRunEnabled: PropTypes.bool.isRequired,
        isMetadataEnabled: PropTypes.bool,
        status: PropTypes.string
    }).isRequired
};

export default InteractiveModeButtons;
