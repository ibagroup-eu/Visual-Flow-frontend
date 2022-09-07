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

const GroupModal = props => {
    const { t } = useTranslation();
    const content = [
        {
            title: t('groupBy:name.name'),
            paragraph: t('groupBy:name.value')
        },
        {
            title: t('groupBy:dropGroupingColumns.name'),
            paragraph: t('groupBy:dropGroupingColumns.value')
        },
        {
            title: t('groupBy:groupBy.name'),
            paragraph: t('groupBy:groupBy.value')
        },
        {
            title: t('groupBy:aggregateFunctions.name'),
            paragraph1: t('groupBy:aggregateFunctions.value1'),
            paragraph2: t('groupBy:aggregateFunctions.value2'),
            paragraph3: t('groupBy:aggregateFunctions.value3'),
            paragraph4: t('groupBy:aggregateFunctions.value4'),
            link1: {
                title: t('groupBy:aggregateFunctions.value9.title'),
                link: t('groupBy:aggregateFunctions.value9.link')
            },
            paragraph5: t('groupBy:aggregateFunctions.value5'),
            paragraph6: t('groupBy:aggregateFunctions.value6'),
            paragraph7: t('groupBy:aggregateFunctions.value7'),
            paragraph8: t('groupBy:aggregateFunctions.value8')
        }
    ];
    return <InfoModal content={content} {...props} />;
};

export default GroupModal;
