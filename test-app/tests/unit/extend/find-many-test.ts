import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import { create } from 'ember-cli-page-object';
import { findMany } from 'ember-cli-page-object/extend';
import hbs from 'htmlbars-inline-precompile';
import { findAll, render } from '@ember/test-helpers';

module(`Extend | findMany`, function(hooks) {
  setupRenderingTest(hooks);

  test('finds by selector and returns array of Elements', async function(assert) {
    let page = create({});

    await render(hbs`<em class="lorem"></em><span class="ipsum"></span>`);

    const foundElements = findMany(page, '.lorem', {});

    assert.equal(foundElements.length, 1);
    assert.deepEqual(foundElements, findAll('.lorem'));
  });

  test('finds deeper in scope', async function(assert) {
    let page = create({ scope: '.lorem' });

    await render(hbs`
    <em class="lorem">
      <span class="dolor"></span>
      <span class="dolor"></span>
    </em>
    <span class="ipsum">
      <span class="dolor"></span>
    </span>
  `);

    const foundElements = findMany(page, '.dolor', {});
    assert.equal(foundElements.length, 2);
    assert.deepEqual(foundElements, findAll('.lorem .dolor'));
  });

  test('returns empty value when no elements found', async function(assert) {
    let page = create({});

    await render(hbs`<em class="lorem"></em>`);

    assert.deepEqual(findMany(page, '.ipsum', {}), []);
  });

  test('testContainer param', async function(assert) {
    let page = create({});

    await render(hbs`
      <span class="ipsum"></span>
      <div class="new-test-root">
        <span class="ipsum"></span>
        <span class="ipsum"></span>
      </div>
    `);

    assert.deepEqual(findMany(page, '.ipsum', { testContainer: '.new-test-root' }), findAll('.new-test-root .ipsum'));
  });

  test('resetScope param', async function(assert) {
    let page = create({ scope: 'my-page' });

    await render(hbs`
      <span class="lorem"></span>
      <div class="my-page">
        <span class="ipsum"></span>
        <span class="ipsum"></span>
      </div>
    `);

    assert.deepEqual(findMany(page, '.lorem', { resetScope: true }), findAll('.lorem'));
  });

  test('contains param', async function(assert) {
    let page = create({});

    await render(hbs`
      <span class="lorem"></span>
      <span class="lorem">Word</span>
      <span class="lorem">Word</span>
    `);

    assert.deepEqual(findMany(page, '.lorem', { contains: 'Word' }), findAll('.lorem').slice(1, 3));
  });

  test('scope param', async function(assert) {
    let page = create({});

    await render(hbs`
      <span class="lorem"></span>
      <span class="ipsum">
        <span class="lorem"></span>
        <span class="lorem"></span>
      </span>
    `);

    assert.deepEqual(findMany(page, '.lorem', { scope: '.ipsum' }), findAll('.ipsum .lorem'));
  });

  test('visible param', async function(assert) {
    let page = create({});

    await render(hbs`
      <span class="lorem" style="display:none"></span>
      <span class="lorem"></span>
      <span class="lorem"></span>
    `);

    assert.deepEqual(findMany(page, '.lorem', { visible: true }), findAll('.lorem').slice(1, 3));
  });

  test('at param', async function(assert) {
    let page = create({});

    await render(hbs`
      <span class="lorem"></span>
      <span class="lorem"></span>
      <span class="lorem"></span>
    `);

    assert.deepEqual(findMany(page, '.lorem', { at: 1 }), [findAll('.lorem')[1]]);
  });

  test('last param', async function(assert) {
    let page = create({});

    await render(hbs`
      <span class="lorem"></span>
      <span class="lorem"></span>
      <span class="lorem"></span>
    `);

    assert.deepEqual(findMany(page, '.lorem', { last: true }), [findAll('.lorem')[2]]);
  });

  module('comma separated selector', function () {
    const SELECTOR = 'comma, separated';

    test('page object with comma separated `scope`', async function (assert) {
      assert.throws(
        () => findMany(create({ scope: SELECTOR })),
        new Error(
          'Usage of comma separated selectors is not supported. Please make sure your selector targets a single selector.'
        ),
      );
    });

    test('comma separated `scope` argument', async function (assert) {
      assert.throws(
        () => findMany(create(), SELECTOR),
        new Error(
          'Usage of comma separated selectors is not supported. Please make sure your selector targets a single selector.'
        ),
      );
    });

    test('comma separated `scope` option', async function (assert) {
      assert.throws(
        () => findMany(create(), '', { scope: SELECTOR }),
        new Error(
          'Usage of comma separated selectors is not supported. Please make sure your selector targets a single selector.'
        ),
      );
    });
  })
});
