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

import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Fade } from '@material-ui/core';
import { uniqueId } from 'lodash';
import sources from './sources';
import Row from './row/Row';
import { insert, remove, swap, update } from '../../../../utils/array';
import { AWS, AZURE, GCP } from '../../../../mxgraph/constants';

export const DEFAULT_SCHEMA_FIELDS = [
    {
        source: 'workspace',
        filePath: ''
        // region: 'auto'
    }
];

export const toField = field => {
    return {
        id: uniqueId(),
        defaultSource: field.source,
        defaultFilePath: field.filePath,
        // defaultRegion: field.region,
        source: field.source,
        filePath: field.filePath
        // region: field.region
    };
};

export const toSchema = field => ({
    source: field.source,
    filePath: field.filePath
    // region: field.region
});

export const checkForErrors = (updatedFields, cloud) => {
    return updatedFields.map(field => {
        if (field.source === 'volumes') {
            return {
                ...field,
                volumesError: !(
                    field.filePath.startsWith('/Volumes/') ||
                    field.filePath.startsWith('dbfs:/Volumes/')
                ),
                platformError: false
            };
        } else if (field.source !== 'workspace') {
            return {
                ...field,
                volumesError: false,
                platformError:
                    cloud === AWS
                        ? !field.filePath.startsWith('s3://')
                        : cloud === GCP
                        ? !field.filePath.startsWith('gs://')
                        : !field.filePath.startsWith('abfss://')
            };
        }

        return {
            ...field,
            volumesError: false,
            platformError: false
        };
    });
};

const isValid = (fields, cloud) => {
    if (cloud === AWS || cloud === GCP || cloud === AZURE) {
        return !fields.some(field => field.volumesError || field.platformError);
    }
};

const ScriptsSchema = forwardRef(
    (
        {
            onSave,
            setIsValid,
            className,
            schemaFields = DEFAULT_SCHEMA_FIELDS,
            ableToEdit = true,
            cloud
        },
        ref
    ) => {
        const [fields, setFields] = React.useState(
            (schemaFields.length === 0 ? DEFAULT_SCHEMA_FIELDS : schemaFields).map(
                toField
            )
        );

        useImperativeHandle(ref, () => ({
            onSaveScriptsSchema() {
                onSave(
                    fields
                        .filter(
                            field =>
                                !(field.source === 'workspace' && !field.filePath)
                        )
                        .map(toSchema)
                );
            }
        }));

        useEffect(() => {
            setIsValid(isValid(fields, cloud));
        }, [fields, setIsValid]);

        const onChangeHandler = index => event =>
            setFields(
                checkForErrors(
                    update(fields, index, {
                        ...fields[index],
                        [event.target.name]: event.target.value
                    }),
                    cloud
                )
            );

        const onAddRow = index => () =>
            setFields(
                checkForErrors(
                    insert(fields, index, {
                        autoFocus: true,
                        ...toField(DEFAULT_SCHEMA_FIELDS[0])
                    }),
                    cloud
                )
            );

        const onRemoveRow = index => () => {
            fields.length > 1 &&
                setFields(checkForErrors(remove(fields, index), cloud));
        };

        const onMoveRowTop = index => () =>
            index !== 0 && setFields(swap(fields, index, index - 1));

        const onMoveRowDown = index => () =>
            index + 1 !== fields.length && setFields(swap(fields, index, index + 1));

        return (
            <Grid container direction="column" className={className}>
                {fields.map((field, index) => (
                    <Fade key={field.id} in>
                        <Grid item>
                            <Row
                                {...field}
                                index={index}
                                editable={ableToEdit}
                                shouldDisableDeleteBtn={fields.length < 2}
                                onChange={onChangeHandler(index)}
                                onAdd={onAddRow(index)}
                                onRemove={onRemoveRow(index)}
                                onMoveDown={onMoveRowDown(index)}
                                onMoveTop={onMoveRowTop(index)}
                                cloud={cloud}
                            />
                        </Grid>
                    </Fade>
                ))}
            </Grid>
        );
    }
);

ScriptsSchema.propTypes = {
    onSave: PropTypes.func.isRequired,
    setIsValid: PropTypes.func.isRequired,
    className: PropTypes.string,
    schemaFields: PropTypes.arrayOf(
        PropTypes.shape({
            source: PropTypes.oneOfType([
                PropTypes.oneOf(
                    Array.from(
                        new Set([
                            ...Object.values(sources.AWS),
                            ...Object.values(sources.GCP),
                            ...Object.values(sources.Azure)
                        ])
                    )
                ),
                PropTypes.array
            ]),
            filePath: PropTypes.string
            // region: PropTypes.string
        })
    ).isRequired,
    ableToEdit: PropTypes.bool,
    cloud: PropTypes.string
};

export default ScriptsSchema;
