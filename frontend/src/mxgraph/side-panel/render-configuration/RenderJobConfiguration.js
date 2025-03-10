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

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { isEqual } from 'lodash';
import { connect } from 'react-redux';
import ReadWriteConfiguration from '../read-write-configuration';
import UnionConfiguration from '../union-configuration';
import EdgeConfiguration from '../edge-configuration';
import JoinConfiguration from '../join-configuration';
import CDCConfiguration from '../cdc-configuration';
import GroupByConfiguration from '../groupby-configuration';
import RemoveDuplicatesConfiguration from '../remove-duplicates-configuration';
import Configuration from '../configuration';
import TransformConfiguration from '../transform-configuration';
import FilterConfiguration from '../filter-configuration';
import CacheConfiguration from '../cache-configuration';
import SortConfiguration from '../sort-configuration';
import SliceConfiguration from '../slice-configuration';
import PivotConfiguration from '../pivot-configuration';
import StringFunctionsConfiguration from '../string-functions-configuration';
import WithColumnConfiguration from '../withcolumn-configuration';
import {
    checkAiValidation,
    checkDatatimeFields,
    checkGroupByFields,
    checkHandleNullFields,
    checkJoinFields,
    checkPivotFields,
    checkReadWriteFields,
    checkRemoveDuplicateFields,
    checkSortFields,
    checkStringFunctionsFields,
    checkTransformerFields,
    checkWithColumnFields,
    isAnyEmpty
} from './validation';
import ValidateConfiguration from '../validate-configuration';
import DateTimeConfiguration from '../datetime-configuration';
import HandleNullConfiguration from '../handlenull-configuration';
import AiConfiguration from '../ai-configuration';

const getJobsConfigurationComponents = (
    ableToEdit,
    setPanelDirty,
    configuration,
    saveCell,
    graph,
    selectedStorage,
    swapEdges
) => ({
    EDGE: {
        component: EdgeConfiguration,
        props: {
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            sourceAndTarget: graph.getSelectionCell
        }
    },
    READ: {
        component: Configuration,
        props: {
            Component: ReadWriteConfiguration,
            isDisabled: checkReadWriteFields,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph,
            selectedStorage
        }
    },
    WRITE: {
        component: Configuration,
        props: {
            Component: ReadWriteConfiguration,
            isDisabled: checkReadWriteFields,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph,
            selectedStorage
        }
    },
    GROUP: {
        component: Configuration,
        props: {
            Component: GroupByConfiguration,
            isDisabled: checkGroupByFields,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    },
    REMOVE_DUPLICATES: {
        component: Configuration,
        props: {
            Component: RemoveDuplicatesConfiguration,
            isDisabled: checkRemoveDuplicateFields,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    },
    JOIN: {
        component: Configuration,
        props: {
            Component: JoinConfiguration,
            isDisabled: checkJoinFields,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            swapEdges,
            graph
        }
    },
    CDC: {
        component: Configuration,
        props: {
            Component: CDCConfiguration,
            isDisabled: isAnyEmpty('name', 'keyColumns'),
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            swapEdges,
            graph
        }
    },
    UNION: {
        component: Configuration,
        props: {
            Component: UnionConfiguration,
            isDisabled: isAnyEmpty('name', 'type'),
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    },
    TRANSFORM: {
        component: Configuration,
        props: {
            Component: TransformConfiguration,
            isDisabled: checkTransformerFields,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    },
    FILTER: {
        component: Configuration,
        props: {
            Component: FilterConfiguration,
            isDisabled: isAnyEmpty('name', 'condition'),
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    },
    CACHE: {
        component: Configuration,
        props: {
            Component: CacheConfiguration,
            isDisabled: isAnyEmpty('name'),
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    },
    SLICE: {
        component: Configuration,
        props: {
            Component: SliceConfiguration,
            isDisabled: isAnyEmpty('name', 'mode', 'columns'),
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    },
    PIVOT: {
        component: Configuration,
        props: {
            Component: PivotConfiguration,
            isDisabled: checkPivotFields,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    },
    SORT: {
        component: Configuration,
        props: {
            Component: SortConfiguration,
            isDisabled: checkSortFields,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    },
    VALIDATE: {
        component: Configuration,
        props: {
            Component: ValidateConfiguration,
            isDisabled: isAnyEmpty('name'),
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    },
    WITH_COLUMN: {
        component: Configuration,
        props: {
            Component: WithColumnConfiguration,
            isDisabled: checkWithColumnFields,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    },
    STRING: {
        component: Configuration,
        props: {
            Component: StringFunctionsConfiguration,
            isDisabled: checkStringFunctionsFields,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    },
    DATETIME: {
        component: Configuration,
        props: {
            Component: DateTimeConfiguration,
            isDisabled: checkDatatimeFields,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph,
            selectedStorage
        }
    },
    HANDLE_NULL: {
        component: Configuration,
        props: {
            Component: HandleNullConfiguration,
            isDisabled: checkHandleNullFields,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph,
            selectedStorage
        }
    },
    AI_TEXT_TASK: {
        component: Configuration,
        props: {
            Component: AiConfiguration,
            isDisabled: checkAiValidation,
            ableToEdit,
            setPanelDirty,
            configuration,
            saveCell,
            graph
        }
    }
});

const RenderJobConfiguration = ({
    configuration,
    sidePanelIsOpen,
    setPanelDirty,
    graph,
    ableToEdit,
    saveCell,
    swapEdges,
    selectedStorage
}) => {
    const jobsConfigurationComponents = getJobsConfigurationComponents(
        ableToEdit,
        setPanelDirty,
        configuration,
        saveCell,
        graph,
        selectedStorage,
        swapEdges
    );

    const [state, setState] = useState(configuration);

    useEffect(() => {
        setState(configuration);
    }, [configuration, sidePanelIsOpen]);

    useEffect(() => {
        setPanelDirty(!isEqual(configuration, state));
    }, [state, configuration, setPanelDirty]);

    if (state.operation) {
        const { component: Component, props } = jobsConfigurationComponents[
            state.operation
        ];
        return (
            <Component
                {...props}
                state={state}
                setState={setState}
                sidePanelIsOpen={sidePanelIsOpen}
            />
        );
    }

    return null;
};

RenderJobConfiguration.propTypes = {
    configuration: PropTypes.object,
    setPanelDirty: PropTypes.func,
    graph: PropTypes.object,
    ableToEdit: PropTypes.bool,
    saveCell: PropTypes.func,
    swapEdges: PropTypes.func,
    selectedStorage: PropTypes.func,
    sidePanelIsOpen: PropTypes.bool
};
const mapStateToProps = state => ({
    sidePanelIsOpen: state.mxGraph.sidePanelIsOpen
});
export default connect(mapStateToProps)(RenderJobConfiguration);
