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

const RemoveDuplicatesModal = props => {
    const { t } = useTranslation();
    const content = [
        {
            title: t('removeDuplicates:name.name'),
            paragraph: t('removeDuplicates:name.value')
        },
        {
            title: t('removeDuplicates:key.name'),
            paragraph: t('removeDuplicates:key.value')
        },
        {
            title: t('removeDuplicates:orderBy.name'),
            paragraph1: t('removeDuplicates:orderBy.value1'),
            paragraph2: t('removeDuplicates:orderBy.value2'),
            paragraph3: t('removeDuplicates:orderBy.value3'),
            paragraph4: t('removeDuplicates:orderBy.value4'),
            paragraph5: t('removeDuplicates:orderBy.value5'),
            paragraph6: t('removeDuplicates:orderBy.value6'),
            paragraph7: t('removeDuplicates:orderBy.value7'),
            paragraph8: t('removeDuplicates:orderBy.value8'),
            paragraph9: t('removeDuplicates:orderBy.value9.name'),
            paragraph10: t('removeDuplicates:orderBy.value9.value')
        }
    ];
    return <InfoModal content={content} {...props} />;
};

export default RemoveDuplicatesModal;
