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

const PivotModal = props => {
    const { t } = useTranslation();
    const content = [
        {
            title: t('pivot:name.name'),
            paragraph: t('pivot:name.value')
        },
        {
            title: t('pivot:operationType.name'),
            paragraph: t('pivot:operationType.value1'),
            paragraph2: t('pivot:operationType.value2'),
            paragraph3: t('pivot:operationType.value3')
        },
        {
            title: t('pivot:groupBy.name'),
            paragraph: t('pivot:groupBy.value')
        },
        {
            title: t('pivot:aggregateFunc.name'),
            paragraph: t('pivot:aggregateFunc.value')
        },
        {
            title: t('pivot:pivotValues.name'),
            paragraph: t('pivot:pivotValues.value')
        },
        {
            title: t('pivot:pivotColumns.name'),
            paragraph: t('pivot:pivotColumns.value')
        },
        {
            title: t('pivot:unchangedColumns.name'),
            paragraph: t('pivot:unchangedColumns.value')
        },
        {
            title: t('pivot:unpivotColumns.name'),
            paragraph: t('pivot:unpivotColumns.value')
        },
        {
            title: t('pivot:unpivotNames.name'),
            paragraph: t('pivot:unpivotNames.value')
        }
    ];
    return <InfoModal content={content} {...props} />;
};

export default PivotModal;
