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

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';

import main from './translations/en/main.json';
import jobs from './translations/en/jobs.json';
import setting from './translations/en/setting.json';
import jobDesigner from './translations/en/jobDesigner.json';
import pipelines from './translations/en/pipelines.json';
import ReadWrite from './translations/en/stages/ReadWrite.json';
import filter from './translations/en/stages/filter.json';
import transformer from './translations/en/stages/transformer.json';
import removeDuplicates from './translations/en/stages/removeDuplicates.json';
import union from './translations/en/stages/union.json';
import groupBy from './translations/en/stages/groupBy.json';
import join from './translations/en/stages/join.json';
import cdc from './translations/en/stages/cdc.json';
import job from './translations/en/stages/job.json';
import notification from './translations/en/stages/notification.json';
import container from './translations/en/stages/container.json';
import pipelineDesigner from './translations/en/pipelineDesigner.json';
import filters from './translations/en/filters.json';
import cache from './translations/en/stages/cache.json';
import sort from './translations/en/stages/sort.json';

export const resources = {
    en: {
        main,
        jobs,
        setting,
        jobDesigner,
        pipelines,
        ReadWrite,
        filter,
        transformer,
        removeDuplicates,
        union,
        groupBy,
        join,
        cdc,
        job,
        notification,
        container,
        pipelineDesigner,
        filters,
        cache,
        sort
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    interpolation: {
        escapeValue: false
    }
});
moment.locale('en');

export default i18n;
