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
import { Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { ParamsTextField } from '../../../mxgraph/sidebar/params/fields';
import SelectField from '../../select-field';
import { READWRITE } from '../../../mxgraph/constants';

const AVAILABILITY_ZONE = 'AVAILABILITY_ZONE';
const MAX_SPOT_PRICE = 'MAX_SPOT_PRICE';
const EBS_VOLUME_TYPE = 'EBS_VOLUME_TYPE';
const VOLUMES = 'VOLUMES';
const DB_SIZE = 'DB_SIZE';

const ebsVolumeType = [
    {
        value: 'none',
        label: 'None'
    },
    {
        value: 'GENERAL_PURPOSE_SSD',
        label: 'General Purpose SSD'
    },
    {
        value: 'THROUGHPUT_OPTIMIZED_HDD',
        label: 'Throughput purpose HDD'
    }
];

const AWSFirstTabPanel = ({
    fields,
    state,
    onChange,
    onError,
    errors,
    ableToEdit
}) => {
    const { t } = useTranslation();

    const zones = useSelector(store => store.clusterUtils.data.zones || []);

    const zonesValues = useMemo(
        () => zones.map(zone => ({ value: zone, label: zone })),
        [zones]
    );

    const [fullZones, setFullZones] = useState([]);

    useEffect(() => {
        if (!fullZones.length && zonesValues.length) {
            setFullZones([{ value: 'auto', label: 'auto' }, ...zonesValues]);
        }
    }, [zonesValues, fullZones]);

    return (
        <>
            <SelectField
                {...fields.AVAILABILITY_ZONE}
                ableToEdit={ableToEdit}
                name={AVAILABILITY_ZONE}
                value={state.AVAILABILITY_ZONE}
                handleInputChange={onChange}
                menuItems={fullZones}
                type={READWRITE}
                closeIcon={false}
            />
            <ParamsTextField
                {...fields.MAX_SPOT_PRICE}
                ableToEdit={ableToEdit}
                name={MAX_SPOT_PRICE}
                value={state.MAX_SPOT_PRICE}
                error={errors.MAX_SPOT_PRICE}
                onError={onError}
                onChange={onChange}
            />
            {!state.AUTOSCALING_STORAGE && (
                <>
                    <Grid container direction="row" alignItems="center" spacing={1}>
                        <Grid item xs={6}>
                            <SelectField
                                {...fields.EBS_VOLUME_TYPE}
                                ableToEdit={ableToEdit}
                                name={EBS_VOLUME_TYPE}
                                value={state.EBS_VOLUME_TYPE}
                                handleInputChange={onChange}
                                menuItems={ebsVolumeType} // API
                                type={READWRITE}
                                closeIcon={false}
                            />
                        </Grid>
                        {state.EBS_VOLUME_TYPE !== 'none' && (
                            <Grid item xs={3}>
                                <ParamsTextField
                                    {...fields.VOLUMES}
                                    ableToEdit={ableToEdit}
                                    name={VOLUMES}
                                    value={state.VOLUMES}
                                    error={errors.VOLUMES}
                                    onError={onError}
                                    onChange={onChange}
                                />
                            </Grid>
                        )}
                        {state.EBS_VOLUME_TYPE !== 'none' && (
                            <Grid item xs={3}>
                                <ParamsTextField
                                    {...fields.DB_SIZE}
                                    ableToEdit={ableToEdit}
                                    name={DB_SIZE}
                                    value={state.DB_SIZE}
                                    error={errors.DB_SIZE}
                                    onError={onError}
                                    onChange={onChange}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Typography variant="subtitle1">
                        {state.EBS_VOLUME_TYPE === 'none'
                            ? t('jobDesigner:Cluster.modal.ebsNone')
                            : t('jobDesigner:Cluster.modal.ebsSsdHdd', {
                                  number: state.VOLUMES * state.DB_SIZE
                              })}
                    </Typography>
                </>
            )}
        </>
    );
};

AWSFirstTabPanel.propTypes = {
    fields: PropTypes.object,
    state: PropTypes.object,
    onError: PropTypes.func,
    errors: PropTypes.object,
    onChange: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default AWSFirstTabPanel;
