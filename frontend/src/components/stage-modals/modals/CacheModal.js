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

const CacheModal = props => {
    const { t } = useTranslation();
    const content = [
        {
            title: t('cache:description.name'),
            paragraph1: t('cache:description.value1'),
            paragraph2: t('cache:description.value2'),
            paragraph3: t('cache:description.value3'),
            paragraph4: t('cache:description.value4'),
            paragraph5: t('cache:description.value5'),
            paragraph6: t('cache:description.value6'),
            paragraph7: t('cache:description.value7')
        },
        {
            title: t('cache:name.name'),
            paragraph: t('cache:name.value')
        },
        {
            title: t('cache:useDisk.name'),
            paragraph: t('cache:useDisk.value')
        },
        {
            title: t('cache:useMemory.name'),
            paragraph: t('cache:useMemory.value')
        },
        {
            title: t('cache:useOffHeap.name'),
            paragraph: t('cache:useOffHeap.value')
        },
        {
            title: t('cache:deserialized.name'),
            paragraph: t('cache:deserialized.value')
        },
        {
            title: t('cache:replication.name'),
            paragraph: t('cache:replication.value')
        }
    ];
    return <InfoModal content={content} {...props} />;
};

export default CacheModal;
