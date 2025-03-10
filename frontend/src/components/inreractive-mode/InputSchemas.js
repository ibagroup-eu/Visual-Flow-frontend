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
import { useTranslation } from 'react-i18next';
import { isUndefined } from 'lodash';

import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';

import { READ } from '../../mxgraph/constants';
import SortedTable from './SortedTable';
import { getHeader } from './helpers';

import useStyles from './InteractiveMode.Styles';

const tabProps = index => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
};

const InputSchemas = ({ operation, panels, tabs }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [value, setValue] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    if (operation === READ || isUndefined(panels)) {
        return (
            <Typography className={classes.schemaWarning}>
                {t('jobDesigner:interactiveMode.noInputSchema')}
            </Typography>
        );
    }

    if (panels.length === 1) {
        return (
            <>
                <Typography style={{ marginBottom: '24px' }}>
                    {t('jobDesigner:interactiveMode.inputSchema')}
                </Typography>
                <SortedTable
                    className={classes.inputTable}
                    headers={getHeader(panels[0].schema)}
                    originalRows={panels[0].schema}
                />
            </>
        );
    }

    return (
        <>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChangeTab}>
                        {tabs.map(tab => (
                            <Tab
                                key={tab.key}
                                label={tab.label}
                                style={{ textTransform: 'none' }}
                                {...tabProps(tab.key)}
                            />
                        ))}
                    </Tabs>
                </Box>
                {panels.map(
                    panel =>
                        value === panel.key && (
                            <TabPanel value={value} index={panel.key}>
                                <SortedTable
                                    className={classes.inputTable}
                                    key={panel.key}
                                    headers={panel.header}
                                    originalRows={panel.schema}
                                />
                            </TabPanel>
                        )
                )}
            </TabContext>
        </>
    );
};

InputSchemas.propTypes = {
    panels: PropTypes.array,
    tabs: PropTypes.array,
    operation: PropTypes.string
};

export default InputSchemas;
