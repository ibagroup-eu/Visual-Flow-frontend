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

const fs = require('fs');
const logger = require('../logger')('utils');

const prepareIndex = config => {
    fs.readFile(
        `${config.app.buildPath}/template.html`,
        'utf8',
        (err, data) => {
            if (err) {
                logger.error(err);
                return;
            }
            const result = data.replace(/%BASE_URL%/g, config.app.baseUrl);
            fs.writeFile(
                `${config.app.buildPath}/index.html`,
                result,
                'utf8',
                error => {
                    if (error) {
                        logger.error(error);
                        return;
                    }
                    logger.info('index.html is ready');
                }
            );
        }
    );
};
module.exports = prepareIndex;
