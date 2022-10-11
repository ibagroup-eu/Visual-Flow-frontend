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
import { isNil, set } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const addStyles = (styles = {}, origin = '') => {
    const parsedStyles = origin.split(';').reduce((acc, current) => {
        const [key, value] = current.split('=');

        return !isNil(value) ? set(acc, key?.trim(), value?.trim()) : acc;
    }, {});

    Object.entries(styles).forEach(
        ([key, value]) => !isNil(value) && set(parsedStyles, key, value)
    );

    return Object.entries(parsedStyles).reduce(
        (acc, [k, v]) => `${acc}${k}=${v};`,
        ''
    );
};
