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
import { Box } from '@material-ui/core';
import { map } from 'lodash';
import useStyles from './TagsPanel.Styles';
import TagsResetButton from '../tags-filter/tags-reset-button/TagsResetButton';
import TagsItem from '../tags-filter/tags-item/TagsItem';

const TagsPanel = ({ data, onCheckTags, resetTags }) => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Box className={classes.tags}>
                {map(data, (value, key) => (
                    <TagsItem key={key} label={key} setChecked={onCheckTags} />
                ))}
            </Box>
            <TagsResetButton resetTags={resetTags} />
        </Box>
    );
};

TagsPanel.propTypes = {
    data: PropTypes.object,
    onCheckTags: PropTypes.func,
    resetTags: PropTypes.func
};

export default TagsPanel;
