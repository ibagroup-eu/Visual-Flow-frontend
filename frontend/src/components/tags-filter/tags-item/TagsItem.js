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
import { Chip, Tooltip, Avatar } from '@material-ui/core';
import { truncate } from 'lodash';
import classNames from 'classnames';
import useStyles from './TagsItem.Styles';

const truncateLabel = label =>
    truncate(label, {
        length: 10
    });

const TagsItem = ({ label, checked = null, setChecked }) => {
    const classes = useStyles();

    return (
        <Tooltip arrow title={label.length > 10 ? label : ''}>
            <Chip
                className={classNames(classes.chip, {
                    [classes.selectedChip]: checked,
                    [classes.chipHover]: checked !== null
                })}
                clickable={checked !== null}
                variant="outlined"
                size="small"
                avatar={<Avatar className={classes.hashIcon}>#</Avatar>}
                label={truncateLabel(label)}
                onClick={() =>
                    setChecked({
                        [label]: !checked
                    })
                }
                onDelete={
                    checked === null
                        ? () =>
                              setChecked({
                                  [label]: false
                              })
                        : null
                }
            />
        </Tooltip>
    );
};

TagsItem.propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool,
    setChecked: PropTypes.func
};

export default TagsItem;
