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

import palette from '../translations/en/jobDesigner.json';
import {
    READ,
    WRITE,
    UNION,
    GROUP,
    REMOVE_DUPLICATES,
    JOIN,
    CDC,
    TRANSFORM,
    FILTER,
    CACHE,
    SORT
} from './constants';

const jobStages = [
    {
        operation: READ,
        name: palette.READ,
        color: '#E9F5FE',
        validation: {
            minCount: 1,
            maxIncomingConnections: 0,
            minOutgoingConnections: 1,
            maxOutgoingConnections: 1
        }
    },
    {
        operation: WRITE,
        name: palette.WRITE,
        color: '#E9F5FE',
        validation: {
            minCount: 1,
            maxCount: 1,
            minIncomingConnections: 1,
            maxIncomingConnections: 1,
            maxOutgoingConnections: 0
        }
    },
    {
        operation: GROUP,
        name: palette.GROUP,
        color: '#EDF7ED',
        validation: {
            minIncomingConnections: 1,
            maxIncomingConnections: 1,
            minOutgoingConnections: 1,
            maxOutgoingConnections: 1
        }
    },
    {
        operation: REMOVE_DUPLICATES,
        name: palette.REMOVE_DUPLICATES,
        color: '#EDF7ED',
        validation: {
            minIncomingConnections: 1,
            maxIncomingConnections: 1,
            minOutgoingConnections: 1,
            maxOutgoingConnections: 1
        }
    },
    {
        operation: FILTER,
        name: palette.FILTER,
        color: '#EDF7ED',
        validation: {
            minIncomingConnections: 1,
            maxIncomingConnections: 1,
            minOutgoingConnections: 1,
            maxOutgoingConnections: 1
        }
    },
    {
        operation: TRANSFORM,
        name: palette.TRANSFORM,
        color: '#EDF7ED',
        validation: {
            minIncomingConnections: 1,
            maxIncomingConnections: 1,
            minOutgoingConnections: 1,
            maxOutgoingConnections: 1
        }
    },
    {
        operation: SORT,
        name: palette.SORT,
        color: '#EDF7ED',
        validation: {
            minIncomingConnections: 1,
            maxIncomingConnections: 1,
            minOutgoingConnections: 1,
            maxOutgoingConnections: 1
        }
    },
    {
        operation: JOIN,
        name: palette.JOIN,
        color: '#FFF5E5',
        validation: {
            minIncomingConnections: 1,
            maxIncomingConnections: 2,
            minOutgoingConnections: 1,
            maxOutgoingConnections: 1
        }
    },
    {
        operation: CDC,
        name: palette.CDC,
        color: '#FFF5E5',
        validation: {
            minIncomingConnections: 1,
            maxIncomingConnections: 2,
            minOutgoingConnections: 1,
            maxOutgoingConnections: 1
        }
    },
    {
        operation: UNION,
        name: palette.UNION,
        color: '#FFF5E5',
        validation: {
            minIncomingConnections: 1,
            maxIncomingConnections: 2,
            minOutgoingConnections: 1,
            maxOutgoingConnections: 1
        }
    },
    {
        operation: CACHE,
        name: palette.CACHE,
        color: '#E6E6FA',
        validation: {
            minIncomingConnections: 1,
            maxIncomingConnections: 1,
            minOutgoingConnections: 1,
            maxOutgoingConnections: 15
        }
    }
];

const jobStagesByType = Object.assign(
    {},
    ...jobStages.map(stage => ({ [stage.operation]: stage }))
);

export { jobStages, jobStagesByType };
