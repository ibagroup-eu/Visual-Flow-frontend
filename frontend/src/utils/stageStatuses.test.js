import { setTemporaryStatuses } from './stageStatuses';
import { RUN_ALL_EVENT, RUN_FAILED_EVENT, RUN_EVENT } from '../mxgraph/constants';

describe('setTemporaryStatuses', () => {
    const definition = {
        graph: [
            {
                id: '10',
                value: { operation: 'READ' },
                edges: [{ source: '10', target: '9' }]
            },
            {
                id: '11',
                value: { operation: 'READ' },
                edges: [{ source: '11', target: '9' }]
            },
            {
                id: '9',
                value: { operation: 'CDC' },
                edges: [{ source: '9', target: '16' }]
            },
            {
                id: '16',
                value: { operation: 'WRITE' },
                edges: []
            },
            {
                id: '18',
                value: { operation: 'EDGE' },
                source: '10',
                target: '9'
            },
            {
                id: '19',
                value: { operation: 'EDGE' },
                source: '11',
                target: '9'
            },
            {
                id: '17',
                value: { operation: 'EDGE' },
                source: '9',
                target: '16'
            }
        ]
    };

    const data = [
        {
            id: '10',
            status: 'succeeded',
            statusMessage: 'Stage has been successfully completed'
        },
        {
            id: '11',
            status: 'succeeded',
            statusMessage: 'Stage has been successfully completed'
        },
        {
            id: '9',
            status: 'succeeded',
            statusMessage: 'Stage has been successfully completed'
        },
        {
            id: '16',
            status: 'running',
            statusMessage: 'Stage is running'
        }
    ];

    it('should set temporary statuses for RUN_ALL_EVENT', () => {
        const command = RUN_ALL_EVENT;
        const updatedData = setTemporaryStatuses(data, command, [], definition);

        expect(updatedData).toContainEqual({
            id: '10',
            status: 'running',
            statusMessage: 'Stage has been successfully completed'
        });

        expect(updatedData).toContainEqual({
            id: '11',
            status: 'running',
            statusMessage: 'Stage has been successfully completed'
        });

        expect(updatedData).toContainEqual({
            id: '9',
            status: 'draft',
            statusMessage: 'Stage has been successfully completed'
        });

        expect(updatedData).toContainEqual({
            id: '16',
            status: 'draft',
            statusMessage: 'Stage is running'
        });
    });

    it('should set temporary statuses for RUN_FAILED_EVENT', () => {
        const command = RUN_FAILED_EVENT;
        const targetStageIds = ['9'];
        const updatedData = setTemporaryStatuses(
            data,
            command,
            targetStageIds,
            definition
        );

        expect(updatedData).toContainEqual({
            id: '9',
            status: 'running',
            statusMessage: 'Stage has been successfully completed'
        });

        expect(updatedData).toContainEqual({
            id: '10',
            status: 'succeeded',
            statusMessage: 'Stage has been successfully completed'
        });

        expect(updatedData).toContainEqual({
            id: '11',
            status: 'succeeded',
            statusMessage: 'Stage has been successfully completed'
        });

        expect(updatedData).toContainEqual({
            id: '16',
            status: 'draft',
            statusMessage: 'Stage is running'
        });
    });

    it('should set temporary statuses for RUN_EVENT', () => {
        const command = RUN_EVENT;
        const targetStageIds = ['10'];
        const updatedData = setTemporaryStatuses(
            data,
            command,
            targetStageIds,
            definition
        );

        expect(updatedData).toContainEqual({
            id: '10',
            status: 'running',
            statusMessage: 'Stage has been successfully completed'
        });

        expect(updatedData).toContainEqual({
            id: '9',
            status: 'draft',
            statusMessage: 'Stage has been successfully completed'
        });

        expect(updatedData).toContainEqual({
            id: '11',
            status: 'succeeded',
            statusMessage: 'Stage has been successfully completed'
        });

        expect(updatedData).toContainEqual({
            id: '16',
            status: 'draft',
            statusMessage: 'Stage is running'
        });
    });

    it('should return the same data if no command is provided', () => {
        const updatedData = setTemporaryStatuses(data, null, [], definition);

        expect(updatedData).toEqual(data);
    });
});
