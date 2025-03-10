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

import { isEmpty, pickBy } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const MESSAGES = {
    KEY_DUPLICATION: 'main:validation.projectParameters.keyDuplication',
    KEY_LENGTH: 'main:validation.projectParameters.keyLength',
    KEY_SYMBOLS: 'main:validation.projectParameters.keySymbols',
    KEY_START_END: 'main:validation.projectParameters.keyStartEnd',
    VALUE_EMPTY: 'main:validation.projectParameters.valueEmpty'
};

export const KEY_VALIDATIONS = {
    [MESSAGES.VALUE_EMPTY]: value => !value?.trim(),
    [MESSAGES.KEY_LENGTH]: key => key?.length > 50,
    [MESSAGES.KEY_SYMBOLS]: key => key?.search(/^[-A-Za-z0-9_]*?$/),
    [MESSAGES.KEY_START_END]: key =>
        key?.search(/^([A-Za-z0-9][-A-Za-z0-9_]*)?[A-Za-z0-9]$/)
};

export const VALUE_VALIDATIONS = {
    [MESSAGES.VALUE_EMPTY]: value => !value?.trim()
};

export const validate = (value, validationSchema, ...args) =>
    Object.entries(validationSchema).reduce((acc, [message, func]) => {
        if (acc) {
            return acc;
        }
        return func(value, ...args) ? message : null;
    }, null);

const useParamValidation = data => {
    const [param, setParam] = useState(data);
    const { t } = useTranslation();

    const key = validate(param?.key, KEY_VALIDATIONS);
    const value = validate(param?.value, VALUE_VALIDATIONS);

    return [pickBy({ key: t(key), value: t(value) }, v => !isEmpty(v)), setParam];
};

export default useParamValidation;
