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
import Row from './row';
import { duplicates, insert, remove, swap, update } from '../../../../utils/array';

export const DEFAULT_SCHEMA_FIELDS = [
    {
        clusterKey: '',
        value: ''
    }
];

export const toField = field => {
    return {
        id: uniqueId(),
        defaultKey: field.clusterKey,
        defaultValue: field.value,
        clusterKey: field.clusterKey,
        value: field.value
    };
};

export const toSchema = field => ({
    clusterKey: field.clusterKey,
    value: field.value
});

export const checkDuplicates = updatedFields => {
    const duplicatedFields = duplicates(updatedFields, field => field.clusterKey);

    return updatedFields.map((field, index) => ({
        ...field,
        duplicated: duplicatedFields.has(index)
    }));
};

const isValid = fields =>
    !fields.some(
        field =>
            field.duplicated ||
            (!!field.clusterKey.trim() && !field.value.trim()) ||
            (!field.clusterKey.trim() && !!field.value.trim())
    );

const TagsSchema = forwardRef(
    (
        {
            onSave,
            setIsValid,
            className,
            schemaFields = DEFAULT_SCHEMA_FIELDS,
            ableToEdit = true
        },
        ref
    ) => {
        const [fields, setFields] = React.useState(
            (schemaFields.length === 0 ? DEFAULT_SCHEMA_FIELDS : schemaFields).map(
                toField
            )
        );

        useImperativeHandle(ref, () => ({
            onSaveTagsSchema() {
                onSave(
                    fields
                        .filter(field => field.clusterKey && field.value)
                        .map(toSchema)
                );
            }
        }));

        useEffect(() => {
            setIsValid(isValid(fields));
        }, [fields, setIsValid]);

        const onChangeHandler = index => event =>
            setFields(
                checkDuplicates(
                    update(fields, index, {
                        ...fields[index],
                        [event.target.name]: event.target.value
                    })
                )
            );

        const onAddRow = index => () =>
            setFields(
                checkDuplicates(
                    insert(fields, index, {
                        autoFocus: true,
                        ...toField(DEFAULT_SCHEMA_FIELDS[0])
                    })
                )
            );

        const onRemoveRow = index => () => {
            fields.length > 1 && setFields(checkDuplicates(remove(fields, index)));
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
                            />
                        </Grid>
                    </Fade>
                ))}
            </Grid>
        );
    }
);

TagsSchema.propTypes = {
    onSave: PropTypes.func.isRequired,
    setIsValid: PropTypes.func.isRequired,
    className: PropTypes.string,
    schemaFields: PropTypes.arrayOf(
        PropTypes.shape({
            clusterKey: PropTypes.string,
            value: PropTypes.string
        })
    ).isRequired,
    ableToEdit: PropTypes.bool
};

export default TagsSchema;
