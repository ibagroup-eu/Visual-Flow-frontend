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

import {
    Home,
    ImportExport,
    Settings,
    Timeline,
    TransformSharp,
    ExitToAppSharp
} from '@material-ui/icons';
import i18n from '../../i18n';
import { setTableDefault } from '../../redux/actions/enhancedTableActions';
import { DATABRICKS } from '../../mxgraph/constants';

const menu = id =>
    id && [
        {
            name: i18n.t('main:Overview'),
            link: `/${id}/overview`,
            Icon: Home
        },
        {
            name: i18n.t('main:Jobs'),
            link: `/${id}/jobs`,
            Icon: TransformSharp,
            dispatch: [setTableDefault()]
        },
        {
            name: i18n.t('main:Pipelines'),
            link: `/${id}/pipelines`,
            Icon: Timeline,
            dispatch: [setTableDefault()]
        },
        {
            name: i18n.t('main:Import'),
            link: `/${id}/import`,
            Icon: ImportExport
        },
        {
            name: i18n.t('main:Settings'),
            items: [
                {
                    name: i18n.t('main:Basic'),
                    link: `/${id}/settings/basic`
                },
                {
                    name: i18n.t('main:Parameters'),
                    link: `/${id}/settings/parameters`
                },
                {
                    name: i18n.t('main:Connections'),
                    link: `/${id}/settings/connections`
                },
                {
                    name: i18n.t('main:Users/Roles'),
                    link: `/${id}/settings/users`,
                    hidden: window.PLATFORM === DATABRICKS
                }
            ],
            Icon: Settings
        },
        {
            name: i18n.t('main:Exit'),
            link: '/',
            Icon: ExitToAppSharp
        }
    ];
export default menu;
