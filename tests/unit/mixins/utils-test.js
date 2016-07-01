import Ember from 'ember';
import UtilsMixin from '../../../mixins/utils';
import { module, test } from 'qunit';

module('Unit | Mixin | utils');

// Replace this with your real tests.
test('it works', function(assert) {
  var UtilsObject = Ember.Object.extend(UtilsMixin);
  var subject = UtilsObject.create();
  assert.ok(subject);
});
