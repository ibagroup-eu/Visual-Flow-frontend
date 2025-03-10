import { get, keyBy } from 'lodash';
import { RUN_ALL_EVENT, RUN_FAILED_EVENT, RUN_EVENT } from '../mxgraph/constants';

// eslint-disable-next-line import/prefer-default-export
export const setTemporaryStatuses = (data, command, targetStageIds, definition) => {
    const graphNodes = get(definition, 'graph', []);
    const edges = graphNodes.filter(node => node.value.operation === 'EDGE');
    const nodes = graphNodes.filter(node => node.value.operation !== 'EDGE');
    const nodeMap = keyBy(data, 'id');

    const getDependentStages = ids => {
        const visited = new Set();
        const stack = [...ids];

        while (stack.length > 0) {
            const currentId = stack.pop();
            if (!visited.has(currentId)) {
                visited.add(currentId);
                const dependents = edges
                    .filter(edge => edge.source === currentId)
                    .map(edge => edge.target);
                stack.push(...dependents);
            }
        }

        return Array.from(visited);
    };

    if (command === RUN_ALL_EVENT) {
        const initialStages = nodes.filter(
            node => !edges.some(edge => edge.target === node.id)
        );

        return nodes.map(node => ({
            id: node.id,
            ...nodeMap[node.id],
            status: initialStages.some(stage => stage.id === node.id)
                ? 'running'
                : 'draft'
        }));
    }

    if (command === RUN_FAILED_EVENT) {
        const dependentStages = getDependentStages(targetStageIds);

        return nodes.map(node => ({
            id: node.id,
            ...nodeMap[node.id],
            // eslint-disable-next-line no-nested-ternary
            status: targetStageIds.includes(node.id)
                ? 'running'
                : dependentStages.includes(node.id)
                ? 'draft'
                : nodeMap[node.id]?.status || 'draft'
        }));
    }

    if (command === RUN_EVENT) {
        const dependentStages = getDependentStages(targetStageIds);

        return nodes.map(node => ({
            id: node.id,
            ...nodeMap[node.id],
            // eslint-disable-next-line no-nested-ternary
            status: targetStageIds.includes(node.id)
                ? 'running'
                : dependentStages.includes(node.id)
                ? 'draft'
                : nodeMap[node.id]?.status || 'draft'
        }));
    }

    return nodes.map(node => ({ id: node.id, ...nodeMap[node.id] }));
};
