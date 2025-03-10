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

import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import SelectField from '../../select-field';
import { READWRITE } from '../../../mxgraph/constants';

const AVAILABILITY_ZONE = 'AVAILABILITY_ZONE';
const LOCAL_SSDS = 'LOCAL_SSDS';

const ssdsNumber = [
    {
        value: 'default',
        label: 'Default'
    },
    {
        value: '0',
        label: '0'
    },
    {
        value: '1',
        label: '1'
    },
    {
        value: '2',
        label: '2'
    },
    {
        value: '4',
        label: '5'
    },
    {
        value: '8',
        label: '8'
    },
    {
        value: '16',
        label: '16'
    },
    {
        value: '24',
        label: '24'
    }
];

const GCPFirstTabPanel = ({ fields, state, onChange, ableToEdit }) => {
    const { t } = useTranslation();

    const zones = useSelector(store => store.clusterUtils.data.zones || []);

    const zonesValues = useMemo(
        () => zones.map(zone => ({ value: zone, label: zone })),
        [zones]
    );

    const [fullZones, setFullZones] = useState([]);

    useEffect(() => {
        if (!fullZones.length && zonesValues.length) {
            setFullZones([
                // { value: 'HA', label: 'HA' },
                // { value: 'auto', label: 'auto' },
                ...zonesValues
            ]);
        }
    }, [zonesValues, fullZones]);

    return (
        <>
            {state.POLICY === 'unrestricted' && (
                <SelectField
                    {...fields.AVAILABILITY_ZONE}
                    // ableToEdit={ableToEdit}
                    ableToEdit={false}
                    name={AVAILABILITY_ZONE}
                    value={state.AVAILABILITY_ZONE}
                    handleInputChange={onChange}
                    menuItems={fullZones}
                    type={READWRITE}
                    closeIcon={false}
                />
            )}
            <SelectField
                {...fields.LOCAL_SSDS}
                ableToEdit={ableToEdit}
                name={LOCAL_SSDS}
                value={state.LOCAL_SSDS}
                handleInputChange={onChange}
                menuItems={ssdsNumber}
                type={READWRITE}
                closeIcon={false}
            />
            <Typography variant="subtitle1">
                {t('jobDesigner:Cluster.modal.ssdSize', {
                    number: 375
                })}
            </Typography>
        </>
    );
};

GCPFirstTabPanel.propTypes = {
    fields: PropTypes.object,
    state: PropTypes.object,
    onChange: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default GCPFirstTabPanel;
