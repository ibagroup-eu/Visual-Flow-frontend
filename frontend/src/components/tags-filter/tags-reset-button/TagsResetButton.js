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
import { Box, Button } from '@material-ui/core';
import { RefreshOutlined } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import useStyles from './TagsResetButton.Styles';

const TagsResetButton = ({ resetTags, disabled }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <Box className={classes.root}>
            <Button
                disabled={disabled}
                size="small"
                className={classes.button}
                onClick={resetTags}
            >
                <RefreshOutlined className={classes.resetIcon} />
                {t('main:reset')}
            </Button>
        </Box>
    );
};
TagsResetButton.propTypes = {
    disabled: PropTypes.bool,
    resetTags: PropTypes.func
};

export default TagsResetButton;
