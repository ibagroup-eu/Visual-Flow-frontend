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
import { Button, Chip } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import useStyles from './TagsButton.Styles';

const TagsButton = ({ open, onOpen, checkedCount }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Button
            aria-controls="popper"
            aria-haspopup="true"
            onClick={onOpen}
            variant="outlined"
            className={classes.buttonName}
        >
            {t('main:tags')}
            <Chip className={classes.count} size="small" label={checkedCount} />
            <ExpandMore
                className={open ? classes.onCloseTags : classes.onOpenTags}
            />
        </Button>
    );
};

TagsButton.propTypes = {
    open: PropTypes.bool,
    onOpen: PropTypes.func,
    checkedCount: PropTypes.number
};

export default TagsButton;
