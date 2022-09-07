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

import mxgraph from 'mxgraph';
import { isNil } from 'lodash';

const { mxUtils, mxObjectCodec } = mxgraph();

class JsonCodec extends mxObjectCodec {
    encode = value => {
        const xmlDoc = mxUtils.createXmlDocument();
        const newObject = xmlDoc.createElement('TaskObject');
        Object.keys(value).forEach(prop => {
            if (Object.prototype.hasOwnProperty.call(value, prop)) {
                newObject.setAttribute(prop, value[prop]);
            }
        });
        return newObject;
    };

    decode = model =>
        Object.keys(model.cells)
            .map(iCell => {
                const currentCell = model.getCell(iCell);
                return !isNil(currentCell.value) && !isNil(currentCell.parent)
                    ? currentCell
                    : null;
            })
            .filter(item => !isNil(item));
}

export default JsonCodec;
