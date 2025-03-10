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
import { Grid, MenuItem, Paper, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import useStyles from './Row.Styles';
import sources from '../sources';
import Arrows from '../../helpers/arrows';
import Actions from '../../helpers/actions';
import { AWS, GCP } from '../../../../../mxgraph/constants';

const VOLUMES_ERROR = 'jobDesigner:clusterSchema.validation.volumesError';
const S_THREE_ERROR = 'jobDesigner:clusterSchema.validation.sThreeError';
const GCS_ERROR = 'jobDesigner:clusterSchema.validation.gcsError';
const ABFSS_ERROR = 'jobDesigner:clusterSchema.validation.abfssError';

const Row = ({
    defaultSource,
    defaultFilePath,
    // defaultRegion,
    // source,
    shouldDisableDeleteBtn = false,
    onChange,
    onAdd,
    onRemove,
    onMoveTop,
    onMoveDown,
    autoFocus = false,
    volumesError = false,
    platformError = false,
    editable = true,
    cloud
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [fullZones, setFullZones] = useState([]);
    const zones = useSelector(state => state.clusterUtils.data.zones || []);

    const zonesValues = useMemo(
        () => zones.map(zone => ({ value: zone, label: zone })),
        [zones]
    );

    useEffect(() => {
        if (!fullZones.length && zonesValues.length) {
            setFullZones([{ value: 'auto', label: 'auto' }, ...zonesValues]);
        }
    }, [fullZones, zonesValues]);

    const getPlatformError = cloud =>
        cloud === AWS
            ? t(S_THREE_ERROR)
            : cloud === GCP
            ? t(GCS_ERROR)
            : t(ABFSS_ERROR);

    return (
        <Paper className={classes.root} variatn="outlined">
            {editable && <Arrows onMoveDown={onMoveDown} onMoveTop={onMoveTop} />}
            <Grid container direction="row" alignItems="center" spacing={1}>
                <Grid item xs={3}>
                    <TextField
                        disabled={!editable}
                        autoFocus={autoFocus}
                        label={t('jobDesigner:clusterSchema.fields.source')}
                        variant="outlined"
                        defaultValue={defaultSource}
                        onChange={onChange}
                        fullWidth
                        name="source"
                        select
                    >
                        {Object.entries(sources[cloud]).map(([key, value]) => (
                            <MenuItem key={key || value} value={value}>
                                {key}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        disabled={!editable}
                        error={volumesError || platformError}
                        helperText={
                            // eslint-disable-next-line no-nested-ternary
                            volumesError
                                ? t(VOLUMES_ERROR)
                                : platformError
                                ? getPlatformError(cloud)
                                : undefined
                        }
                        label={t('jobDesigner:clusterSchema.fields.filePath')}
                        variant="outlined"
                        defaultValue={defaultFilePath}
                        onChange={onChange}
                        fullWidth
                        name="filePath"
                    />
                </Grid>

                {/* <Grid item xs={3}>
                    {source === 's3' && (
                        <TextField
                            disabled={!editable}
                            label={t('jobDesigner:clusterSchema.fields.region')}
                            variant="outlined"
                            defaultValue={defaultRegion}
                            onChange={onChange}
                            fullWidth
                            name="region"
                            select
                        >
                            {fullZones.map(zone => (
                                <MenuItem key={zone.value} value={zone.value}>
                                    {zone.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                </Grid> */}
            </Grid>

            {editable && (
                <Actions
                    className={classes.actions}
                    shouldDisableDeleteBtn={shouldDisableDeleteBtn}
                    onAdd={onAdd}
                    onRemove={onRemove}
                />
            )}
        </Paper>
    );
};

Row.propTypes = {
    onMoveTop: PropTypes.func.isRequired,
    onMoveDown: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    autoFocus: PropTypes.bool,
    volumesError: PropTypes.bool,
    platformError: PropTypes.bool,
    defaultSource: PropTypes.oneOf(
        Array.from(
            new Set([
                ...Object.values(sources.AWS),
                ...Object.values(sources.GCP),
                ...Object.values(sources.Azure)
            ])
        )
    ),
    // source: PropTypes.oneOf(
    //     Array.from(
    //         new Set([
    //             ...Object.values(sources.aws),
    //             ...Object.values(sources.gpc),
    //             ...Object.values(sources.azure)
    //         ])
    //     )
    // ),
    defaultFilePath: PropTypes.string,
    defaultRegion: PropTypes.string,
    shouldDisableDeleteBtn: PropTypes.bool,
    cloud: PropTypes.string
};

export default Row;
