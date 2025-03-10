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

import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Grid, Slider, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { noop } from 'lodash';
import { ParamsSwitchField } from '../../../mxgraph/sidebar/params/fields';

const ON_DEMAND_SPOT = 'ON_DEMAND_SPOT';
const IS_ON_DEMAND_SPOT = 'IS_ON_DEMAND_SPOT';
const ENABLE_CREDENTIAL = 'ENABLE_CREDENTIAL';

// eslint-disable-next-line complexity
const AdvancedAWSContent = ({ fields, state, onChange, ableToEdit }) => {
    const { t } = useTranslation();

    const workerType = useRef({ memory: 0, cores: 0 });

    const maxSliderValue = useMemo(
        () =>
            state.AUTOSCALING_WORKERS ? +state.MAX_WORKERS + 1 : +state.WORKERS + 1,
        [state.AUTOSCALING_WORKERS, state.MAX_WORKERS, state.WORKERS]
    );

    const handleChangeSlider = (e, value) => {
        if (value !== state.ON_DEMAND_SPOT) {
            onChange({
                ...e,
                target: {
                    ...e.target,
                    name: ON_DEMAND_SPOT,
                    value
                },
                persist: noop
            });
        }
    };

    return (
        <>
            {!(state.POLICY === 'unrestricted' && state.NODES === 'single') && (
                <>
                    <Typography variant="subtitle1">{`Advanced options On-demand/spot composition ${
                        state.AUTOSCALING_WORKERS
                            ? `${state.MIN_WORKERS}-${state.MAX_WORKERS}`
                            : state.WORKERS
                    } Workers: ${
                        state.AUTOSCALING_WORKERS
                            ? `${+state.MIN_WORKERS *
                                  workerType.current.memory}-${+state.MAX_WORKERS *
                                  workerType.current.memory}`
                            : state.WORKERS * workerType.current.memory
                    } GB Memory, ${
                        state.AUTOSCALING_WORKERS
                            ? `${+state.MIN_WORKERS *
                                  workerType.current.cores}-${+state.MAX_WORKERS *
                                  workerType.current.cores}`
                            : state.WORKERS * workerType.current.cores
                    } Cores`}</Typography>
                    <Grid container direction="row" alignItems="center" spacing={5}>
                        <Grid item xs={6}>
                            <Slider
                                valueLabelDisplay="auto"
                                value={state.ON_DEMAND_SPOT}
                                step={1}
                                min={0}
                                max={maxSliderValue}
                                onChange={handleChangeSlider}
                            />
                        </Grid>

                        {state.POLICY === 'unrestricted' && (
                            <Grid item xs={6}>
                                <ParamsSwitchField
                                    {...fields.IS_ON_DEMAND_SPOT}
                                    ableToEdit={ableToEdit}
                                    name={IS_ON_DEMAND_SPOT}
                                    value={state.IS_ON_DEMAND_SPOT}
                                    onChange={onChange}
                                    defaultValue
                                />
                            </Grid>
                        )}
                    </Grid>
                </>
            )}
            <Typography variant="subtitle2">
                {t('jobDesigner:Cluster.modal.iamRole')}
            </Typography>
            <ParamsSwitchField
                {...fields.ENABLE_CREDENTIAL}
                ableToEdit={ableToEdit && state.ACCESS_MODE !== 'NONE'}
                name={ENABLE_CREDENTIAL}
                value={state.ENABLE_CREDENTIAL}
                onChange={onChange}
                defaultValue={false}
            />
        </>
    );
};

AdvancedAWSContent.propTypes = {
    fields: PropTypes.object,
    state: PropTypes.object,
    onChange: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default AdvancedAWSContent;
