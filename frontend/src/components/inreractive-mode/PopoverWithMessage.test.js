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
import { shallow } from 'enzyme';

import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { IconButton, Popover, Typography } from '@material-ui/core';
import PopoverWithMessage from './PopoverWithMessage';

describe('PopoverWithMessage', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            open: true,
            anchorEl: <p>el</p>,
            onClose: jest.fn(),
            text: 'message'
        };

        wrapper = shallow(<PopoverWithMessage {...defaultProps} />);
    });

    it('should render components', () => {
        expect(wrapper).toBeDefined();

        expect(wrapper.find(Popover).length).toBe(1);
        expect(wrapper.find(Typography).length).toBe(1);
        expect(wrapper.find(IconButton).length).toBe(0);
    });

    it('should render components for long message', () => {
        const props = {
            ...defaultProps,
            text:
                'scala.collection.MapLike.default(MapLike.scala:235)\n\tat scala.collection.MapLike.default$(MapLike.scala:234)\n\tat scala.collection.AbstractMap.default(Map.scala:65)\n\tat scala.collection.mutable.HashMap.apply(HashMap.scala:69)\n\tat by.iba.vf.spark.transformation.ExecutionData.$anonfun$getStageInputData$2(ExecutionData.scala:32)\n\tat scala.collection.immutable.List.map(List.scala:293)\n\tat by.iba.vf.spark.transformation.ExecutionData.getStageInputData(ExecutionData.scala:32)\n\tat by.iba.vf.spark.transformation.TransformationJob$.$anonfun$run$2(TransformationJob.scala:43)\n\tat scala.collection.TraversableLike.$anonfun$flatMap$1(TraversableLike.scala:292)\n\tat scala.collection.immutable.Set$Set1.foreach(Set.scala:141)\n\tat scala.collection.TraversableLike.flatMap(TraversableLike.scala:292)\n\tat scala.collection.TraversableLike.flatMap$(TraversableLike.scala:289)\n\tat scala.collection.AbstractTraversable.flatMap(Traversable.scala:108)\n\tat by.iba.vf.spark.transformation.TransformationJob$.$anonfun$run$1(TransformationJob.scala:38)\n\tat by.iba.vf.spark.transformation.TransformationJob$.$anonfun$run$1$adapted(TransformationJob.scala:36)\n\tat scala.collection.immutable.List.foreach(List.scala:431)\n\tat by.iba.vf.spark.transformation.TransformationJob$.run(TransformationJob.scala:36)\n\tat by.iba.vf.spark.transformation.TransformationJob$.main(TransformationJob.scala:73)\n\tat by.iba.vf.spark.transformation.TransformationJob.main(TransformationJob.scala)'
        };

        wrapper = shallow(<PopoverWithMessage {...props} />);

        expect(wrapper.find(Typography).text()).toBe(
            'scala.collection.MapLike.default(MapLike.scala:235...'
        );
        expect(wrapper.find(ExpandMore).length).toBe(1);
        expect(wrapper.find(ExpandLess).length).toBe(0);

        wrapper.find(IconButton).prop('onClick')();
        wrapper.update();
        expect(wrapper.find(ExpandLess).length).toBe(1);
        expect(wrapper.find(ExpandMore).length).toBe(0);
    });
});
