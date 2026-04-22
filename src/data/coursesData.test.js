import test from 'node:test';
import assert from 'node:assert/strict';

import COURSES_DATA from './coursesData.js';

test('marketing digital AI module has provisional lessons for production', () => {
  const marketingCourse = COURSES_DATA.find(course => course.basicInfo?.slug === 'marketing-digital');

  assert.ok(marketingCourse, 'marketing-digital course should exist');

  const aiModule = marketingCourse.curriculum.find(module => module.id === 4);

  assert.ok(aiModule, 'AI marketing module should exist');
  assert.ok(aiModule.lessons.length > 0, 'AI marketing module should not be empty');
});
