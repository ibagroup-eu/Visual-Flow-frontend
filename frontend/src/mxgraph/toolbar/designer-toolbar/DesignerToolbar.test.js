/*
 * Copyright (c) 2022 IBA Group, a.s. All rights reserved.
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

// eslint-disable-next-line max-classes-per-file
import React from 'react';
import { shallow } from 'enzyme';
import { DesignerToolbar } from './DesignerToolbar';

describe('DesignerToolbar', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            classes: {},
            graph: {},
            zoom: jest.fn()
        };

        const wrapper = func(<DesignerToolbar {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();
        expect(wrapper).toBeDefined();
    });

    describe('lengthCheck', () => {
        const [wrapper] = init();
        it.each([
            { source: { length: false }, expected: true },
            { source: { length: true }, expected: false }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(wrapper.instance().lengthCheck(source)).toBe(expected);
            }
        );
    });

    describe('undoManagerChangedStage', () => {
        const [wrapper] = init();
        const instance = wrapper.instance();

        it('should return matching element for mxGeometryChange object', () => {
            class mxGeometryChange {
                previous = {};

                geometry = {};
            }

            const mxGeometry = new mxGeometryChange();
            mxGeometry.previous.width = 1;
            mxGeometry.geometry.width = 2;
            const changes = [mxGeometry];

            const actual = instance.undoManagerChangedStage({ changes });
            expect(actual).toBe(mxGeometry);
        });

        it('should return matching element for mxStyleChange object', () => {
            class mxStyleChange {
                cell = {};
            }

            const mxStyle = new mxStyleChange();
            mxStyle.cell.edge = {};
            const changes = [mxStyle];

            const actual = instance.undoManagerChangedStage({ changes });
            expect(actual).toBe(mxStyle);
        });
    });

    describe('changedConfigurationCheck', () => {
        it(' should return matching element', () => {
            class mxValueChange {}
            const mxValue = new mxValueChange();
            const changes = [mxValue];

            const [wrapper] = init();
            const actual = wrapper.instance().changedConfigurationCheck({ changes });
            expect(actual).toBe(mxValue);
        });
    });

    describe('edgeCheck', () => {
        const [wrapper] = init();
        it.each([
            {
                source: {
                    value: {
                        attributes: {
                            successPath: { value: 'test' },
                            operation: { value: 'EDGE' }
                        }
                    },
                    previous: {
                        attributes: {
                            successPath: { value: 'test' }
                        }
                    }
                },
                expected: true
            },
            {
                source: {
                    value: {
                        attributes: {
                            successPath: { value: 'test' },
                            operation: { value: 'EDGE' }
                        }
                    },
                    previous: {
                        attributes: {
                            successPath: { value: 'value' }
                        }
                    }
                },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(wrapper.instance().edgeCheck(source)).toBe(expected);
            }
        );
    });

    describe('joinCDCChangedEdge', () => {
        it('should return matching element', () => {
            const [wrapper] = init();
            const source = {
                child: {
                    edge: {}
                }
            };
            expect(
                wrapper
                    .instance()
                    .joinCDCChangedEdge([{ changes: [source] }], 1, true)
            ).toBe(source);
        });
    });

    describe('joinCDCDeletedEdge', () => {
        it('should return matching element', () => {
            const [wrapper] = init();
            const source = {
                child: {
                    edge: {}
                }
            };
            expect(
                wrapper
                    .instance()
                    .joinCDCDeletedEdge([{ changes: [source] }], 1, true)
            ).toBe(source);
        });
    });

    describe('linkSwitchCheck', () => {
        const [wrapper] = init();
        const fields = {
            value: {
                attributes: {
                    newDataset: { value: 'Dataset' },
                    leftDataset: { value: 'Dataset' }
                }
            },
            previous: {
                attributes: {
                    rightDataset: { value: 'Dataset' },
                    oldDataset: { value: 'Dataset' }
                }
            }
        };
        it.each([
            {
                source: {
                    operation: 'CDC',
                    ...fields
                },
                expected: true
            },
            {
                source: {
                    operation: 'JOIN',
                    ...fields
                },
                expected: true
            },
            {
                source: {
                    operation: 'EDGE',
                    ...fields
                },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(wrapper.instance().linkSwitchCheck(source, 'operation')).toBe(
                    expected
                );
            }
        );
    });

    describe('joinCDCChange', () => {
        const [wrapper] = init();
        const instance = wrapper.instance();
        jest.spyOn(instance, 'lengthCheck').mockReturnValue(true);
        class mxValueChange {}

        const mxValue = new mxValueChange();

        it('should return element when operation is JOIN', () => {
            mxValue.operation = 'JOIN';
            const changes = [mxValue];

            const actual = instance.joinCDCChange({ changes }, 'operation');
            expect(actual).toBe(mxValue);
        });

        it('should return element when operation is CDC', () => {
            mxValue.operation = 'CDC';
            const changes = [mxValue];

            const actual = instance.joinCDCChange({ changes }, 'operation');
            expect(actual).toBe(mxValue);
        });
    });

    describe('undoButtonsDeactivation', () => {
        const props = { setDirty: jest.fn() };
        const [wrapper] = init(props);
        const instance = wrapper.instance();

        it('should enable undo button when indexes match', () => {
            const expectedResult = { redo: false, undo: true };

            instance.undoButtonsDeactivation(1, 1);
            expect(instance.state.undoButtonsDisabling).toEqual(expectedResult);
            expect(props.setDirty).toHaveBeenCalledWith(false);
        });

        it('should disable undo button when indexes do not match', () => {
            const expectedResult = { undo: false, redo: false };

            instance.undoButtonsDeactivation(1, 2);
            expect(instance.state.undoButtonsDisabling).toEqual(expectedResult);
            expect(props.setDirty).toHaveBeenCalledWith(true);
        });
    });

    describe('redoButtonsDeactivation', () => {
        const props = { setDirty: jest.fn() };
        const [wrapper] = init(props);
        const instance = wrapper.instance();

        it('should enable redo button when indexes match', () => {
            const expectedResult = {
                undo: false,
                redo: true
            };

            instance.redoButtonsDeactivation(3, 1, 3);
            expect(instance.state.undoButtonsDisabling).toEqual(expectedResult);
        });

        it('should disable redo button when indexes do not match', () => {
            const expectedResult = { undo: false, redo: false };

            instance.redoButtonsDeactivation(1, 3, 6);
            expect(instance.state.undoButtonsDisabling).toEqual(expectedResult);
            expect(props.setDirty).toHaveBeenCalledWith(true);
        });
    });

    describe('undoManagerUndo', () => {
        it('should call fireEvent when change is significant', () => {
            const props = {
                setUndoManagerConfig: jest.fn(),
                data: { definition: { graph: {} } }
            };
            const undo = jest.fn();
            const isSignificant = jest.fn().mockReturnValue(true);
            const change = { undo, isSignificant };

            const [wrapper] = init(props);
            const instance = wrapper.instance();
            jest.spyOn(instance, 'changedConfigurationCheck').mockReturnValue(
                change
            );
            jest.spyOn(instance, 'joinCDCChange').mockReturnValue(change);
            jest.spyOn(instance, 'undoButtonsDeactivation').mockReturnValue(change);
            const fireEvent = jest.fn();

            instance.fireEvent = fireEvent;
            instance.indexOfNextAdd = 1;
            instance.history = [change];

            const func = instance.undoManagerUndo();
            expect(func).toBeDefined();

            func.bind(instance)();

            expect(undo).toHaveBeenCalled();
            expect(fireEvent).toHaveBeenCalled();
        });
    });

    describe('undoManagerRedo', () => {
        it('should call fireEvent when change is significant', () => {
            const props = {
                setUndoManagerConfig: jest.fn(),
                data: { definition: { graph: {} } }
            };
            const redo = jest.fn();
            const isSignificant = jest.fn().mockReturnValue(true);
            const change = { redo, isSignificant };

            const [wrapper] = init(props);
            const instance = wrapper.instance();
            jest.spyOn(instance, 'changedConfigurationCheck').mockReturnValue(
                change
            );
            jest.spyOn(instance, 'joinCDCChange').mockReturnValue(change);
            jest.spyOn(instance, 'joinCDCChangedEdge').mockReturnValue(change);

            jest.spyOn(instance, 'redoButtonsDeactivation').mockReturnValue(change);
            const fireEvent = jest.fn();

            instance.fireEvent = fireEvent;
            instance.indexOfNextAdd = 0;
            instance.history = [change];
            instance.state.undoManager.redo = jest.fn();
            const func = instance.undoManagerRedo();
            expect(func).toBeDefined();

            func.bind(instance)();

            expect(redo).toHaveBeenCalled();
            expect(instance.state.undoManager.redo).toHaveBeenCalled();
            expect(fireEvent).toHaveBeenCalled();
        });
    });
});
