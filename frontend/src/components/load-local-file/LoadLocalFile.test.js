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
import { Button, CircularProgress } from '@material-ui/core';
import LoadLocalFile from './LoadLocalFile';
import { READ, WRITE } from '../../mxgraph/constants';

describe('LoadLocalFile', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            inputValues: {
                operation: WRITE,
                storage: 'cluster',
                path: '/test/path/for/file'
            },
            handleInputChange: jest.fn(),
            ableToEdit: true,
            fileData: {},
            uploadLocalFile: jest.fn(),
            downloadLocalFile: jest.fn(),
            clearLocalFilesState: jest.fn(),
            loading: false,
            fileUploaded: true,
            fileDownloaded: {},
            jobData: {
                definition: {
                    graph: [
                        {
                            id: 1,
                            value: {
                                storage: 'cluster',
                                path: '/test/path/for/file'
                            }
                        }
                    ]
                }
            },
            jobStatus: 'Succeeded',
            stageId: 1
        };
        global.URL.createObjectURL = jest.fn();

        wrapper = shallow(<LoadLocalFile {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls useEffect', () => {
        wrapper = mount(<LoadLocalFile {...props} />);
        expect(props.clearLocalFilesState).toBeCalledTimes(2);
    });

    it('should calls useEffect without fileDownloaded and fileUploaded', () => {
        wrapper = mount(
            <LoadLocalFile {...props} fileDownloaded={null} fileUploaded={null} />
        );
        expect(props.clearLocalFilesState).toBeCalledTimes(0);
    });

    it('should change useEffect with operation READ', () => {
        wrapper = mount(
            <LoadLocalFile
                {...props}
                inputValues={{ ...props.inputValues, operation: READ }}
            />
        );
        expect(props.clearLocalFilesState).toBeCalledTimes(2);
    });

    it('should render CircularProgress', () => {
        wrapper = shallow(<LoadLocalFile {...props} loading />);
        expect(wrapper.find(CircularProgress)).toHaveLength(1);
    });

    it('should calls loadFile', () => {
        wrapper.find(Button).invoke('onClick')();
        expect(props.downloadLocalFile).toBeCalled();
    });

    it('should calls loadFile with operation READ', () => {
        wrapper = shallow(
            <LoadLocalFile
                {...props}
                inputValues={{ ...props.inputValues, operation: READ }}
            />
        );
        wrapper.find(Button).invoke('onClick')();
        expect(props.uploadLocalFile).toBeCalled();
    });

    it('should calls loadFile with operation READ and uploaded true', () => {
        wrapper = shallow(
            <LoadLocalFile
                {...props}
                inputValues={{
                    ...props.inputValues,
                    uploaded: 'true',
                    operation: READ
                }}
            />
        );
        wrapper.find(Button).invoke('onClick')();
        expect(props.downloadLocalFile).toBeCalled();
    });
});
