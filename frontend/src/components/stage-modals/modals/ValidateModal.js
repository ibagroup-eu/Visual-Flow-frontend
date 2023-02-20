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
import { validationType } from '../../../mxgraph/side-panel/validate-configuration/validate-modal/validate-modal-row/validate-add-validation-button/ValidateAddValidationButton';
import InfoModal from '../info';

const ValidateModal = props => {
    const { t } = useTranslation();
    const content = [
        {
            title: t('validation:name.name'),
            paragraph: t('validation:name.value')
        },
        {
            title: t('validation:isError.name'),
            paragraph: t('validation:isError.value')
        },
        {
            title: t('validation:validationSchema.name'),
            paragraph: t('validation:validationSchema.value')
        },
        {
            title: t('validation:column.name'),
            paragraph: t('validation:column.value')
        },
        {
            title: t('validation:dataType.name'),
            paragraph1: t('validation:dataType.value'),
            paragraph2: t('validation:dataType.value2')
        },
        ...validationType.slice(1).map(type => ({
            title: t(`validation:${type}.name`),
            paragraph: t(`validation:${type}.value`)
        }))
    ];
    return <InfoModal content={content} {...props} />;
};

export default ValidateModal;
