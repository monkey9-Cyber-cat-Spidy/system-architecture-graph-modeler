import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SystemGraphModeler } from '../src/graphModeler.mjs';

describe('System Architecture Graph Modeler Suite', () => {
  const modeler = new SystemGraphModeler();

  test('should generate topological execution order for dependency DAG', () => {
    // Database -> ApiGateway -> FrontendApp
    modeler.addDependency('Database', 'ApiGateway');
    modeler.addDependency('ApiGateway', 'FrontendApp');

    const order = modeler.getTopologicalOrder();
    assert.deepStrictEqual(order, ['Database', 'ApiGateway', 'FrontendApp']);
  });

  test('should detect circular deadlocks and throw error', () => {
    const cyclic = new SystemGraphModeler();
    cyclic.addDependency('A', 'B');
    cyclic.addDependency('B', 'C');
    cyclic.addDependency('C', 'A');

    assert.throws(() => cyclic.getTopologicalOrder(), /Cyclic dependency detected/);
  });
});
