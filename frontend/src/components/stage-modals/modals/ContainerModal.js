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

const ContainerModal = props => {
    const { t } = useTranslation();

    const imagePullPolicy = {
        title: t('container:imagePullPolicy.name'),
        paragraph1: t('container:imagePullPolicy.value'),
        paragraph2: t('container:imagePullPolicy.value2'),
        paragraph3: t('container:imagePullPolicy.value3'),
        paragraph4: t('container:imagePullPolicy.value4')
    };

    const imagePullSecretType = {
        title: t('container:imagePullSecretType.name'),
        paragraph1: t('container:imagePullSecretType.value'),
        paragraph2: t('container:imagePullSecretType.value2'),
        paragraph3: t('container:imagePullSecretType.value3'),
        paragraph4: t('container:imagePullSecretType.value4')
    };

    const content = [
        {
            title: t('container:name.name'),
            paragraph: t('container:name.value')
        },
        {
            title: t('container:image.name'),
            paragraph: t('container:image.value')
        },
        imagePullPolicy,
        {
            title: t('container:requestsCpu.name'),
            paragraph: t('container:requestsCpu.value')
        },
        {
            title: t('container:requestsMemory.name'),
            paragraph: t('container:requestsMemory.value')
        },
        {
            title: t('container:limitsCpu.name'),
            paragraph: t('container:limitsCpu.value')
        },
        {
            title: t('container:limitsMemory.name'),
            paragraph: t('container:limitsMemory.value')
        },
        {
            title: t('container:mountProjectParams.name'),
            paragraph: t('container:mountProjectParams.value')
        },
        imagePullSecretType,
        {
            title: t('container:imagePullSecretName.name'),
            paragraph: t('container:imagePullSecretName.value')
        },
        {
            title: t('container:username.name'),
            paragraph: t('container:username.value')
        },
        {
            title: t('container:password.name'),
            paragraph: t('container:password.value')
        },
        {
            title: t('container:registry.name'),
            paragraph: t('container:registry.value')
        },
        {
            title: t('container:command.name'),
            paragraph: t('container:command.value')
        }
    ];

    return <InfoModal content={content} {...props} />;
};

export default ContainerModal;
