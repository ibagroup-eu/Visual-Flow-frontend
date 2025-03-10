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

import React from 'react';
import { shallow, mount } from 'enzyme';
import { Button, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Import from './Import';
import { PageSkeleton } from '../../components/skeleton';
import ImportModal from './import-modal';
import AlertWindow from '../../components/alert-window';
import showNotification from '../../components/notification/showNotification';
import { DATABRICKS } from '../../mxgraph/constants';

jest.mock('../../components/notification/showNotification', () => jest.fn());

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('Import', () => {
    let wrapper;
    let defaultProps;

    afterEach(() => jest.restoreAllMocks());

    beforeEach(() => {
        defaultProps = {
            t: jest.fn(),
            loading: false,
            accessToImport: true,
            checkAccess: jest.fn(),
            importToProject: jest.fn(),
            projectId: 'projectId',
            existedJobs: { loading: false, data: { jobs: [] } },
            existedPipelines: { loading: false, data: { pipelines: [] } },
            getJobs: jest.fn(),
            getPipelines: jest.fn()
        };

        showNotification.mockClear();

        jest.spyOn(React, 'useRef').mockImplementation(() => ({
            current: { files: ['file_1'] }
        }));

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = shallow(<Import {...defaultProps} />).dive();
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render PageSkeleton', () => {
        wrapper.setProps({
            loading: true
        });
        expect(wrapper.find(PageSkeleton)).toHaveLength(1);
    });

    it('should render TextField', () => {
        expect(wrapper.find(TextField)).toHaveLength(1);
    });

    it('should render AlertWindow', () => {
        wrapper.setProps({
            accessToImport: false
        });
        expect(wrapper.find(AlertWindow)).toHaveLength(1);
    });

    it('should render ImportModal', () => {
        expect(wrapper.find(ImportModal)).toHaveLength(1);
    });

    it('should close ImportModal', () => {
        const useStateSpy = jest.spyOn(React, 'useState');
        wrapper.find(ImportModal).simulate('close');
        expect(useStateSpy).toHaveBeenCalled();
    });

    it('should load the file', () => {
        const useStateSpy = jest.spyOn(React, 'useState');

        const file = new Blob([{ fileContents: 'file content' }], {
            type: 'application/json'
        });
        wrapper.find('input').simulate('change', {
            target: {
                files: [file]
            }
        });

        expect(useStateSpy).toHaveBeenCalled();
    });

    it('should click the load file button', () => {
        const readAsText = jest.fn();
        jest.spyOn(global, 'FileReader').mockImplementation(() => ({ readAsText }));

        wrapper.find('input').simulate('change');

        const [, loadFileButton] = wrapper.find(Button).map(button => button);
        loadFileButton.simulate('click');

        expect(readAsText).toBeCalledWith('file_1');
    });

    it('should call useEffect when changing projectId', () => {
        const projectId = 'newProjectId';
        wrapper = mount(<Import {...defaultProps} />);
        wrapper.setProps({ projectId });

        expect(defaultProps.checkAccess).toBeCalledWith(projectId);
        expect(defaultProps.getJobs).toBeCalledWith(projectId);
        expect(defaultProps.getPipelines).toBeCalledWith(projectId);
    });

    it('should call importToProject prop', () => {
        wrapper.find(ImportModal).prop('importResources')([]);
        expect(defaultProps.importToProject).toHaveBeenCalled();
    });

    it('should call onload and show error notification', () => {
        const reader = { readAsText: jest.fn() };

        jest.spyOn(global, 'FileReader').mockImplementation(() => reader);

        wrapper.find('input').simulate('change');

        const [, loadFileButton] = wrapper.find(Button).map(button => button);
        loadFileButton.simulate('click');

        reader.onload();

        expect(showNotification).toHaveBeenCalled();
        expect(showNotification.mock.calls[0][1]).toBe('error');
    });

    it('should call onload', () => {
        const reader = { readAsText: jest.fn() };

        jest.spyOn(global, 'FileReader').mockImplementation(() => reader);

        wrapper.find('input').simulate('change');

        const [, loadFileButton] = wrapper.find(Button).map(button => button);
        loadFileButton.simulate('click');

        reader.onload({
            target: { result: JSON.stringify({ pipelines: [], jobs: [] }) }
        });

        expect(showNotification).not.toHaveBeenCalled();
    });

    it('should throw error - jobs are not defined', () => {
        const reader = { readAsText: jest.fn() };

        jest.spyOn(global, 'FileReader').mockImplementation(() => reader);

        wrapper.find('input').simulate('change');

        const [, loadFileButton] = wrapper.find(Button).map(button => button);
        loadFileButton.simulate('click');
        reader.onload({
            target: { result: JSON.stringify({ pipelines: [], jobs_spoiled: [] }) }
        });
        expect(showNotification).toBeCalledWith('Bad structure of file', 'error');
    });

    // /////////////////
    // it('should throw error - job ids are different', () => {
    //     const reader = { readAsText: jest.fn() };
    //     const fileContent = {
    //         target: {
    //             result: JSON.stringify({
    //                 pipelines: [
    //                     {
    //                         spec: {
    //                             templates: [
    //                                 {},
    //                                 {
    //                                     dag: {
    //                                         tasks: [
    //                                             {
    //                                                 arguments: {
    //                                                     parameters: [
    //                                                         {
    //                                                             name: 'configMap',
    //                                                             value: 'job_id_10'
    //                                                         },
    //                                                         {
    //                                                             name: 'name2',
    //                                                             value: 'value2'
    //                                                         },
    //                                                         {
    //                                                             name: 'pipelineId',
    //                                                             value: 'value3'
    //                                                         }
    //                                                     ]
    //                                                 }
    //                                             }
    //                                         ]
    //                                     }
    //                                 }
    //                             ]
    //                         }
    //                     }
    //                 ],
    //                 jobs: [{ metadata: { name: 'job_id_01' } }]
    //             })
    //         }
    //     };

    //     jest.spyOn(global, 'FileReader').mockImplementation(() => reader);

    //     wrapper.find('input').simulate('change');

    //     const [, loadFileButton] = wrapper.find(Button).map(button => button);
    //     loadFileButton.simulate('click');
    //     reader.onload(fileContent);
    //     expect(showNotification).toBeCalledWith('Bad structure of file', 'error');
    // });

    it('should throw error', () => {
        const reader = { readAsText: jest.fn() };
        const fileContent = {
            target: {
                result: JSON.stringify({
                    pipelines: [
                        {
                            definition: {
                                graph: [
                                    {
                                        id: 1,
                                        value: {
                                            jobId: 'job1',
                                            jobName: 'Andrew',
                                            name: 'data'
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    jobs: [
                        {
                            definition: {
                                graph: [
                                    {
                                        id: 1,
                                        value: {
                                            host: '1',
                                            method: 'GET',
                                            name: 'data',
                                            operation: 'READ',
                                            storage: 'request'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                })
            }
        };

        jest.spyOn(global, 'FileReader').mockImplementation(() => reader);

        wrapper.find('input').simulate('change');

        const [, loadFileButton] = wrapper.find(Button).map(button => button);
        loadFileButton.simulate('click');
        reader.onload(fileContent);
        expect(showNotification).toBeCalledWith('Bad structure of file', 'error');
    });

    it('should parse file successfuly', () => {
        Object.defineProperty(window, 'PLATFORM', {
            value: DATABRICKS
        });

        expect(wrapper.find(AlertWindow).prop('showAlert')).toBeFalsy();

        const reader = { readAsText: jest.fn() };
        const fileContent = {
            target: {
                result: JSON.stringify({
                    pipelines: [
                        {
                            name: 'pipeline1',
                            definition: {
                                graph: [
                                    {
                                        id: 1,
                                        value: {
                                            jobId: 'job1',
                                            jobName: 'Andrew',
                                            name: 'data',
                                            operation: 'JOB'
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    jobs: [
                        {
                            name: 'job1',
                            definition: {
                                graph: [
                                    {
                                        id: 1,
                                        value: {
                                            host: '1',
                                            method: 'GET',
                                            name: 'data',
                                            operation: 'READ',
                                            storage: 'request'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                })
            }
        };

        jest.spyOn(global, 'FileReader').mockImplementation(() => reader);

        wrapper.find('input').simulate('change');

        const [, loadFileButton] = wrapper.find(Button).map(button => button);
        loadFileButton.simulate('click');
        reader.onload(fileContent);
        expect(wrapper.find(ImportModal).prop('display')).toBe(true);
    });
});
