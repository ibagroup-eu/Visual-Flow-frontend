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
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import InfoModal from '../info';
import { operationsType } from '../../../mxgraph/side-panel/datetime-configuration/DateTimeConfiguration';
import { DATETIME } from '../../../mxgraph/constants';
import schemas from '../../../mxgraph/side-panel/schemas';

const getContent = t => [
    {
        title: t('datetime:name.name'),
        paragraph: t('datetime:name.value')
    },
    {
        title: t('datetime:operationType.name'),
        paragraph1: t('datetime:operationType.value')
    }
];

export const formatType = value => {
    switch (value) {
        case 'trunc':
            return 'value2';
        case 'date_trunc':
            return 'value3';
        case 'to_unix_timestamp':
        case 'from_unixtime':
            return 'value4';
        default:
            return 'value1';
    }
};

const getOperations = t => {
    const schema = get(schemas, DATETIME, []).slice(1);
    const currentField = (field, type) => ({
        title: t(`datetime:${field}.name`),
        paragraph1: t(
            `datetime:${field}.${
                field === 'option.format' ? formatType(type) : 'value'
            }`
        )
    });
    const currentInfo = type =>
        schema.reduce(
            (acc, { field, conditions }) =>
                conditions?.find(({ operationType }) => operationType === type)
                    ? [...acc, currentField(field, type)]
                    : acc,
            []
        );
    return operationsType.reduce(
        (prevValue, type) => ({
            ...prevValue,
            [type]: [
                {
                    title: '',
                    paragraph1: t(`datetime:operationTypes.${type}.value`)
                },
                {
                    title: t('datetime:option.targetColumn.name'),
                    paragraph1: t('datetime:option.targetColumn.value')
                },
                ...currentInfo(type)
            ]
        }),
        {}
    );
};

const DatetimeModal = props => {
    const { t } = useTranslation();

    return (
        <InfoModal
            content={getContent(t)}
            operations={getOperations(t)}
            {...props}
        />
    );
};

export default DatetimeModal;
