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

export default {
    isValidLimits: (value, multiple, min, max, t) => {
        if (value < 0) {
            return t('main:validation.positive');
        }
        if (value % multiple !== 0) {
            return t('main:validation.multiple', { multiple });
        }
        if (value < min || value > max) {
            return t('main:validation.range', { min, max });
        }
        return null;
    },
    isValidName: (value, t) => {
        const reg = /^[a-z0-9]([\w\\.-]*[a-z0-9])?$/i;
        if (!value.trim()) {
            return t('main:validation.notBlank');
        }
        if (value.length < 3 || value.length > 63) {
            return t('main:validation.incorrectJobLength');
        }
        if (!reg.test(value)) {
            return t('main:validation.incorrectCharacters');
        }
        return null;
    },
    isValidPositive: (value, t) =>
        value > 0 ? null : t('main:validation.positive'),
    isValidRange: (value, min, max, t) =>
        value >= min && value <= max
            ? null
            : t('main:validation.range', { min, max })
};
