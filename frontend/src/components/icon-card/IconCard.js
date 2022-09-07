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

import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    Typography
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './IconCard.Styles';

const IconCard = ({ title, color, Icon, children, sizing, IconColor }) => {
    const classes = useStyles();

    const avatarSizing = size => {
        let avatarStyle;
        if (size) {
            avatarStyle = classes.utilizationAvatar;
        } else {
            avatarStyle = classes.jobsAndPipelinesAvatar;
        }
        return avatarStyle;
    };

    return (
        <Card className={classes.root}>
            <CardHeader
                classes={{ content: classes.header }}
                disableTypography
                avatar={
                    <Avatar
                        variant="rounded"
                        style={{ backgroundColor: color }}
                        className={avatarSizing(sizing)}
                    >
                        <Icon style={{ fill: IconColor }} />
                    </Avatar>
                }
                title={<Typography variant="h6">{title}</Typography>}
            />
            <CardContent>{children}</CardContent>
        </Card>
    );
};

IconCard.propTypes = {
    sizing: PropTypes.bool,
    title: PropTypes.string,
    color: PropTypes.string,
    Icon: PropTypes.object,
    IconColor: PropTypes.string,
    children: PropTypes.object
};

export default IconCard;
