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

import { set } from 'lodash';

import { jobStagesByType } from './jobStages';
import UnitConfig from '../unitConfig';

jest.mock('../unitConfig', () => ({
    JOB: {
        STAGES: {
            READ: true,
            WRITE: true,
            GROUP: true,
            REMOVE_DUPLICATES: true,
            FILTER: true,
            TRANSFORM: true,
            SORT: true,
            SLICE: true,
            JOIN: true,
            UNION: true,
            CDC: true,
            CACHE: true,
            VALIDATE: true,
            WITH_COLUMN: true,
            PIVOT: true,
            DATETIME: true,
            STRING: true,
            HANDLE_NULL: true,
            AI_TEXT_TASK: true
        }
    }
}));

describe('jobStages', () => {
    const theme = {
        palette: {
            info: { background: '#E8F0FF', light: '#F3EAFF' },
            success: { background: '0001' },
            warning: { background: '0002' },
            primary: { background: '0003' }
        }
    };

    const expectedResult = {
        READ: {
            operation: 'READ',
            name: undefined,
            show: expect.any(Boolean),
            color: '#E8F0FF',
            validation: {
                minCount: 1,
                maxIncomingConnections: 0,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        WRITE: {
            operation: 'WRITE',
            name: undefined,
            show: expect.any(Boolean),
            color: '#E8F0FF',
            validation: {
                minCount: 1,
                maxCount: 1,
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                maxOutgoingConnections: 0
            }
        },
        GROUP: {
            operation: 'GROUP',
            name: undefined,
            show: expect.any(Boolean),
            color: '0001',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        REMOVE_DUPLICATES: {
            operation: 'REMOVE_DUPLICATES',
            name: undefined,
            show: expect.any(Boolean),
            color: '0001',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        FILTER: {
            operation: 'FILTER',
            name: undefined,
            show: expect.any(Boolean),
            color: '0001',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        TRANSFORM: {
            operation: 'TRANSFORM',
            name: undefined,
            show: expect.any(Boolean),
            color: '0001',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        SORT: {
            operation: 'SORT',
            name: undefined,
            show: expect.any(Boolean),
            color: '0001',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        SLICE: {
            operation: 'SLICE',
            name: undefined,
            show: expect.any(Boolean),
            color: '0001',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        PIVOT: {
            operation: 'PIVOT',
            name: undefined,
            show: expect.any(Boolean),
            color: '0001',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        WITH_COLUMN: {
            operation: 'WITH_COLUMN',
            name: undefined,
            color: '0001',
            show: expect.any(Boolean),
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        DATETIME: {
            operation: 'DATETIME',
            name: undefined,
            show: expect.any(Boolean),
            color: '0001',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        JOIN: {
            operation: 'JOIN',
            name: undefined,
            show: expect.any(Boolean),
            color: '0002',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 2,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        UNION: {
            operation: 'UNION',
            name: undefined,
            show: expect.any(Boolean),
            color: '0002',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 2,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        CDC: {
            operation: 'CDC',
            name: undefined,
            show: expect.any(Boolean),
            color: '0002',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 2,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        CACHE: {
            operation: 'CACHE',
            name: undefined,
            show: expect.any(Boolean),
            color: '#F3EAFF',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 15
            }
        },
        VALIDATE: {
            operation: 'VALIDATE',
            name: undefined,
            show: expect.any(Boolean),
            color: '#F3EAFF',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        STRING: {
            operation: 'STRING',
            name: undefined,
            color: '0001',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: expect.any(Boolean)
        },
        HANDLE_NULL: {
            operation: 'HANDLE_NULL',
            name: undefined,
            show: expect.any(Boolean),
            color: '0001',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            }
        },
        AI_TEXT_TASK: {
            operation: 'AI_TEXT_TASK',
            name: undefined,
            color: '0003',
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: expect.any(Boolean)
        }
    };

    it('jobStagesByType should return correct result', () => {
        expect(jobStagesByType(theme)).toEqual(expectedResult);
    });

    it('should hide stages based on the config', () => {
        Object.keys(UnitConfig.JOB.STAGES).forEach(name =>
            set(UnitConfig.JOB.STAGES, name, false)
        );

        expect(jobStagesByType(theme)).toEqual({});
    });
});
