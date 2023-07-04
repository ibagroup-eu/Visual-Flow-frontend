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

const WithColumnModal = props => {
    const { t } = useTranslation();
    const content = [
        {
            title: t('withColumn:description.name'),
            paragraph1: t('withColumn:description.value1'),
            paragraph2: t('withColumn:description.value2'),
            paragraph3: t('withColumn:description.value3'),
            paragraph4: t('withColumn:description.value4'),
            paragraph5: t('withColumn:description.value5'),
            paragraph6: t('withColumn:description.value6'),
            paragraph7: t('withColumn:description.value7'),
            paragraph8: t('withColumn:description.value8')
        },
        {
            title: t('withColumn:name.name'),
            paragraph: t('withColumn:name.value')
        },
        {
            title: t('withColumn:operationType.name'),
            paragraph1: t('withColumn:operationType.value1'),
            paragraph2: t('withColumn:operationType.value2'),
            paragraph3: t('withColumn:operationType.value3'),
            paragraph4: t('withColumn:operationType.value4'),
            paragraph5: t('withColumn:operationType.value5'),
            paragraph6: t('withColumn:operationType.value6'),
            paragraph7: t('withColumn:operationType.value7'),
            paragraph8: t('withColumn:operationType.value8'),
            paragraph9: t('withColumn:operationType.value9')
        },
        {
            title: t('withColumn:column.name'),
            paragraph: t('withColumn:column.value')
        }
    ];
    return <InfoModal content={content} {...props} />;
};

export default WithColumnModal;
