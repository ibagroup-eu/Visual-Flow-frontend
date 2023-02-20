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
import InfoModal from '../info';

const getCommonFields = t => [
    {
        title: t('stringFunctions:name.name'),
        paragraph: t('stringFunctions:name.value')
    },
    {
        title: t('stringFunctions:operationType.name'),
        paragraph: t('stringFunctions:operationType.value')
    },
    {
        title: t('stringFunctions:sourceColumn.name'),
        paragraph: t('stringFunctions:sourceColumn.value')
    },
    {
        title: t('stringFunctions:targetColumn.name'),
        paragraph: t('stringFunctions:targetColumn.value')
    }
];

const getSubstrIndexFields = t => [
    {
        title: t('stringFunctions:delimiter.name'),
        paragraph: t('stringFunctions:delimiter.value')
    },
    {
        title: t('stringFunctions:count.name'),
        paragraph: t('stringFunctions:count.value')
    }
];

const getContent = t => [
    ...getCommonFields(t),
    {
        title: t('stringFunctions:separator.name'),
        paragraph: t('stringFunctions:separator.value')
    },
    {
        title: t('stringFunctions:decimalPlaces.name'),
        paragraph: t('stringFunctions:decimalPlaces.value')
    },
    {
        title: t('stringFunctions:substringSearch.name'),
        paragraph: t('stringFunctions:substringSearch.value')
    },
    {
        title: t('stringFunctions:position.name'),
        paragraph: t('stringFunctions:position.value')
    },
    {
        title: t('stringFunctions:length.name'),
        paragraph: t('stringFunctions:length.value')
    },
    {
        title: t('stringFunctions:limit.name'),
        paragraph: t('stringFunctions:limit.value')
    },
    ...getSubstrIndexFields(t)
];

const StringFunctionsModal = props => {
    const { t } = useTranslation();
    return <InfoModal content={getContent(t)} {...props} />;
};

export default StringFunctionsModal;
