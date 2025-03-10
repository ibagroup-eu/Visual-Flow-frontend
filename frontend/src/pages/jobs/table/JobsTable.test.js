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

import { mount, shallow } from 'enzyme';
import React from 'react';
import HistoryPanel from '../../../components/history-panel/HistoryPanel';
import EnhancedTable from '../../../components/table/enhanced-table';
import JobsTable from './JobsTable';

jest.mock('../../../unitConfig', () => ({
    JOB: { HISTORY: true },
    PIPELINE: { HISTORY: true }
}));

jest.mock('../../../routes/withPagination', () => x => x);

describe('Jobs', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            projectId: 'id',
            data: [
                {
                    name: 'field',
                    pipelineId: 'testid',
                    runnable: false,
                    status: 'Running',
                    startedAt: '1',
                    finishedAt: '1',
                    lastModified: '1',
                    pipelineInstances: false
                }
            ],
            pipelines: [],
            remove: jest.fn(),
            confirmationWindow: jest.fn(),
            run: jest.fn(),
            stop: jest.fn(),
            copy: jest.fn(),
            ableToEdit: true,
            lastRun: 'last hour',
            setLastRun: jest.fn(),
            status: 'Running',
            setStatus: jest.fn(),
            setCurrentPage: jest.fn(),
            currentPage: 0,
            rowsPerPage: 4,
            getHistory: jest.fn(),
            onCheckTags: jest.fn(),
            resetTags: jest.fn(),
            checkedTags: [['test', true]]
        };

        wrapper = shallow(<JobsTable {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render EnhancedTable', () => {
        expect(wrapper.find(EnhancedTable)).toHaveLength(1);
    });

    it('should render EnhancedTable correct filter prop', () => {
        expect(
            wrapper.find(EnhancedTable).prop('filter').props.children
        ).toHaveLength(3);
    });

    it('should calls onClose prop in ExportModalWindow component', () => {
        wrapper
            .find(EnhancedTable)
            .prop('filter')
            .props.children.at(0)
            .props.onClose();
    });

    it('should calls onChange prop in first DropdownFilter component', () => {
        wrapper
            .find(EnhancedTable)
            .prop('filter')
            .props.children.at(1)
            .props.children.props.onChange({ target: { value: 'test' } });
        expect(props.setStatus).toBeCalledWith('test');
        expect(props.setCurrentPage).toBeCalledWith(0);
    });

    it('should calls onChange prop in second DropdownFilter component', () => {
        wrapper
            .find(EnhancedTable)
            .prop('filter')
            .props.children.at(2)
            .props.children.props.onChange({ target: { value: 'test' } });
        expect(props.setLastRun).toBeCalledWith('test');
        expect(props.setCurrentPage).toBeCalledWith(0);
    });

    it('should render children', () => {
        wrapper = mount(<JobsTable {...props} />);
        wrapper
            .children()
            .at(1)
            .props()
            .children({ item: props.data[0] });
    });

    it('should calls onClick for all actions in getActions', () => {
        wrapper
            .children()
            .at(1)
            .props()
            .children({ item: props.data[0] })
            .props.children.at(6)
            .props.actions.forEach(action => action.onClick());
        expect(props.confirmationWindow).toBeCalled();
        wrapper
            .children()
            .at(1)
            .props()
            .children({ item: { ...props.data[0], status: 'Draft' } })
            .props.children.at(6)
            .props.actions.at(0)
            .onClick();
    });

    it('should render correct actions prop in ActionsCell with withRunAction and should have 2 actions', () => {
        wrapper = shallow(<JobsTable {...props} ableToEdit={false} />);
        expect(
            wrapper
                .children()
                .at(1)
                .props()
                .children({ item: props.data[0] })
                .props.children.at(6).props.actions
        ).toHaveLength(3);
    });

    it('should render correct actions prop in ActionsCell with withRunAction and should have 3 actions', () => {
        wrapper = shallow(<JobsTable {...props} ableToEdit={false} />);
        wrapper.setProps({ ableToEdit: false });
        expect(
            wrapper
                .children()
                .at(1)
                .props()
                .children({ item: { ...props.data[0], runnable: true } })
                .props.children.at(6).props.actions
        ).toHaveLength(4);
    });

    it('should call onClose prop', () => {
        wrapper.find(HistoryPanel).prop('onClose')();
    });
});
