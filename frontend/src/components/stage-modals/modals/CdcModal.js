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

const CdcModal = props => {
    const { t } = useTranslation();
    const content = [
        {
            title: t('cdc:description.name'),
            paragraph1: t('cdc:description.value1'),
            paragraph2: t('cdc:description.value2'),
            paragraph3: t('cdc:description.value3'),
            paragraph4: t('cdc:description.value4'),
            paragraph5: t('cdc:description.value5'),
            paragraph6: t('cdc:description.value6'),
            paragraph7: t('cdc:description.value7'),
            paragraph8: t('cdc:description.value8'),
            paragraph9: t('cdc:description.value9'),
            paragraph10: t('cdc:description.value10')
        },
        {
            title: t('cdc:name.name'),
            paragraph: t('cdc:name.value')
        },
        {
            title: t('cdc:linkOrdering.name'),
            paragraph: t('cdc:linkOrdering.value')
        },
        {
            title: t('cdc:key.name'),
            paragraph: t('cdc:key.value')
        },
        {
            title: t('cdc:mode.name'),
            paragraph1: t('cdc:mode.value1'),
            paragraph2: t('cdc:mode.value2')
        }
    ];
    return <InfoModal content={content} {...props} />;
};

export default CdcModal;
