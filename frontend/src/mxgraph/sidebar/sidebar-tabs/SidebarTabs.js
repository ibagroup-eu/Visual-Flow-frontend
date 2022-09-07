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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Palette from '../palette';
import Params from '../params';
import useStyles from './SidebarTabs.Styles';
import TabPanel from '../tab-pannel';
import { setGraphDirty } from '../../../redux/actions/mxGraphActions';

const SidebarTabs = ({ name, graph = {}, setDirty, ableToEdit }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    React.useEffect(() => {
        if (name) {
            setValue(ableToEdit ? 0 : 1);
        } else {
            setValue(1);
        }
    }, [ableToEdit]);

    return (
        <div className={classes.root}>
            <AppBar position="static" color="transparent">
                <Tabs
                    value={ableToEdit ? value : 0}
                    onChange={(e, newValue) => setValue(ableToEdit ? newValue : 1)}
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    {ableToEdit && <Tab label={t('jobDesigner:PALETTE')} />}
                    <Tab label={t('jobDesigner:PARAMS')} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Palette graph={graph} setDirty={setDirty} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Params ableToEdit={ableToEdit} />
            </TabPanel>
        </div>
    );
};

SidebarTabs.propTypes = {
    name: PropTypes.string,
    graph: PropTypes.object,
    setDirty: PropTypes.func,
    ableToEdit: PropTypes.bool
};

const mapDispatchToProps = {
    setDirty: setGraphDirty
};

export default connect(null, mapDispatchToProps)(SidebarTabs);
