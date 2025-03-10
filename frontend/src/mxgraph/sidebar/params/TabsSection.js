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
import { Box, Tab, Tabs } from '@material-ui/core';
import { entries } from 'lodash';
import TabPanel from '../tab-pannel';
import useStyles from './Params.Styles';
import Section from './Section';
import { DATABRICKS } from '../../constants';

const TabsSection = ({ label: title, fields, render, ableToEdit }) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    return (
        <Section label={title}>
            <Box className={classes.tabs}>
                <Tabs
                    value={value}
                    onChange={(e, newValue) => setValue(ableToEdit ? newValue : 0)}
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    {entries(fields).map(
                        ([, { label, needs }]) =>
                            needs !== DATABRICKS && <Tab key={label} label={label} />
                    )}
                </Tabs>
            </Box>
            <Box className={classes.content}>
                {entries(fields).map(([key, field], index) => (
                    <TabPanel
                        key={key}
                        type="notifications"
                        value={value}
                        index={index}
                    >
                        {render(field.fields)}
                    </TabPanel>
                ))}
            </Box>
        </Section>
    );
};

TabsSection.propTypes = {
    label: PropTypes.string,
    fields: PropTypes.object,
    render: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default TabsSection;
