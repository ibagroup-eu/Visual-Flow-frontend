/* eslint-disable complexity */
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
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Popover, Typography } from '@material-ui/core';
import { ErrorOutline, ExpandLess, ExpandMore } from '@material-ui/icons';

import useStyles from './InteractiveMode.Styles';

const PopoverWithMessage = ({
    open,
    anchorEl,
    onClose,
    text,
    type = 'error',
    maxLength = 50
}) => {
    const classes = useStyles();
    const [isExpanded, setIsExpanded] = useState(false);

    const isTextLong = text.length > maxLength;
    const displayedText =
        isTextLong && !isExpanded ? `${text.slice(0, maxLength)}...` : text;

    const toggleText = () => {
        setIsExpanded(!isExpanded);
    };

    const renderIcon = () => {
        if (type === 'error') {
            return <ErrorOutline size="small" className={classes.popoverIcon} />;
        }
        return null;
    };

    return (
        <Popover open={open} anchorEl={anchorEl} onClose={onClose}>
            <div className={classes.popoverContainer}>
                <Typography variant="body1" className={classes.popoverText}>
                    {renderIcon()}
                    {displayedText}
                    {isTextLong && (
                        <IconButton size="small" onClick={toggleText}>
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    )}
                </Typography>
            </div>
        </Popover>
    );
};

PopoverWithMessage.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    anchorEl: PropTypes.any,
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['error', 'message', '']),
    maxLength: PropTypes.number
};

export default PopoverWithMessage;
