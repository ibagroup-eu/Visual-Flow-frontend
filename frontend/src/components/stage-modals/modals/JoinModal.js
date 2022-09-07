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

const JoinModal = props => {
    const { t } = useTranslation();
    const content = [
        {
            title: t('join:name.name'),
            paragraph: t('join:name.value')
        },
        {
            title: t('join:joinType.name'),
            paragraph: t('join:joinType.value'),
            paragraph2: t('join:joinType.value2'),
            paragraph3: t('join:joinType.value3'),
            paragraph4: t('join:joinType.value4'),
            paragraph5: t('join:joinType.value5'),
            paragraph6: t('join:joinType.value6'),
            paragraph7: t('join:joinType.value7')
        },
        {
            title: t('join:linkOrdering.name'),
            paragraph: t('join:linkOrdering.value')
        },
        {
            title: t('join:key.name'),
            paragraph: t('join:key.value')
        }
    ];
    return <InfoModal content={content} {...props} />;
};

export default JoinModal;
