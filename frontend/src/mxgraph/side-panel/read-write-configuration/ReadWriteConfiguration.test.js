/*
 *  Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import { Divider } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ReadWriteConfiguration, {
    getStorageComponent
} from './ReadWriteConfiguration';
import DividerWithText from '../helpers/DividerWithText';
import Db2Storage from './db2-storage';
import { STORAGES } from '../../constants';

describe('ReadWriteConfiguration', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            state: {
                storage: 'db2',
                connectionName: 'test',
                writeMode: 'Overwrite'
            },
            ableToEdit: true,
            onChange: jest.fn(),
            openModal: jest.fn(),
            connection: { connectionName: 'test' }
        };

        wrapper = shallow(<ReadWriteConfiguration {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render Divider without name', () => {
        wrapper = shallow(
            <ReadWriteConfiguration {...props} state={{ storage: 'db2' }} />
        );
        expect(wrapper.find(DividerWithText)).toHaveLength(0);
        expect(wrapper.find(Divider)).toHaveLength(1);
    });

    it('should calls useEffect', () => {
        wrapper = mount(<ReadWriteConfiguration {...props} />);
    });

    it('should render Autocomplete without value', () => {
        wrapper = mount(<ReadWriteConfiguration {...props} state={{}} />);
        expect(wrapper.find(Autocomplete).prop('value')).toBe(null);
    });

    it('should calls getOptionLabel without option.label', () => {
        expect(wrapper.find(Autocomplete).prop('getOptionLabel')('test')).toBe(
            'test'
        );
    });

    it('should calls onChange prop with undefined storage', () => {
        wrapper.find(Autocomplete).prop('onChange')({});
        expect(props.onChange).toBeCalledWith('storage', undefined);
        expect(props.onChange).toBeCalledWith('connectionName', null);
    });

    it('should calls onChange prop with test storage and without connectionName', () => {
        wrapper = shallow(
            <ReadWriteConfiguration {...props} state={{ storage: 'db2' }} />
        );
        wrapper.find(Autocomplete).prop('onChange')({}, { value: 'test' });
        expect(props.onChange).toBeCalledWith('storage', 'test');
    });

    it('should calls onClick for Autocomplete renderInput prop', () => {
        wrapper
            .find(Autocomplete)
            .prop('renderInput')()
            .props.children.at(1)
            .props.onClick();
        expect(props.openModal).toBeCalledWith('connectionName');
    });

    it('should calls handleInputChange prop for Comp', () => {
        wrapper.find(Db2Storage).prop('handleInputChange')({
            target: { value: 'test', name: 'testname' }
        });
        expect(props.onChange).toBeCalledWith('testname', 'test');
    });

    const storages = [
        STORAGES.DB2.value,
        STORAGES.MONGO.value,
        STORAGES.COS.value,
        STORAGES.AWS.value,
        STORAGES.ELASTIC.value,
        STORAGES.CASSANDRA.value,
        STORAGES.REDIS.value,
        STORAGES.REDSHIFT.value,
        STORAGES.STDOUT.value
    ];
    storages.forEach(storage => {
        it(`should render ${storage} storage`, () => {
            wrapper = shallow(
                <ReadWriteConfiguration {...props} state={{ storage }} />
            );
            expect(getStorageComponent(storage)).toHaveLength(1);
        });
    });
});
