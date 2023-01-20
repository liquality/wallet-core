const detectCircularDeps = require('../../index');

describe('Circular Dependencies Issues', () => {
  it('Should not cause a problem', async () => {
    const promise = detectCircularDeps.problems();
    require('../always-empty/a');
    const results = await promise;
    if (results[0]) {
      throw new Error(results[0].message);
    }
    /*
    * if your module starts a server or run something prevents the
    * process from exiting, you need to exit it after the promise was resolved
    */
    process.exit(0);
  });
  it('Should not cause a problem', async () => {
    const promise = detectCircularDeps.problems();
    require('../always-empty/a.solved');
    const results = await promise;
    if (results[0]) {
      throw new Error(results[0].message);
    }
    process.exit(0);
  });
});
