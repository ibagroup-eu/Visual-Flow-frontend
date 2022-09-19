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

const SliceModal = props => {
    const { t } = useTranslation();
    const content = [
        {
            title: t('slice:name.name'),
            paragraph: t('slice:name.value')
        },
        {
            title: t('slice:Mode.name'),
            paragraph: t('slice:Mode.value'),
            paragraph2: t('slice:Mode.value2'),
            paragraph3: t('slice:Mode.value3')
        },
        {
            title: t('slice:Columns.name'),
            paragraph: t('slice:Columns.value')
        }
    ];
    return <InfoModal content={content} {...props} />;
};

export default SliceModal;
