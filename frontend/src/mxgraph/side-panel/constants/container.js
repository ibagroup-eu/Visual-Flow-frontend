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

export const LIMITS = ['requestsCpu', 'requestsMemory', 'limitsCpu', 'limitsMemory'];

export const CPU = {
    CORES: { label: 'cores', value: 'c' },
    MILICORES: { label: 'milicores', value: 'm' }
};

export const MEMORY = {
    KB: { label: 'KB', value: 'k' },
    MB: { label: 'MB', value: 'M' },
    GB: { label: 'GB', value: 'G' }
};

export const IMAGE_PULL_POLICY = [
    { label: 'If not present', value: 'IfNotPresent' },
    { label: 'Always', value: 'Always' },
    { label: 'Never', value: 'Never' }
];

export const IMAGE_PULL_SECRET_TYPE = {
    NOT_APPLICABLE: { label: 'Not applicable', value: 'NOT_APPLICABLE' },
    NEW: { label: 'New', value: 'NEW' },
    PROVIDED: { label: 'Provided', value: 'PROVIDED' }
};

export const secretFields = [
    'accessKey',
    'secretKey',
    'password',
    'iamApiKey',
    'iamServiceId',
    'index'
];
