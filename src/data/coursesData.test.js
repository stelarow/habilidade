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

test('business intelligence AI dashboard module has provisional lessons for production', () => {
  const biCourse = COURSES_DATA.find(course => course.basicInfo?.slug === 'excel-avancado-business-intelligence');

  assert.ok(biCourse, 'business intelligence course should exist');

  const aiDashboardModule = biCourse.curriculum.find(module => module.id === 4);

  assert.ok(aiDashboardModule, 'AI dashboard module should exist');
  assert.ok(aiDashboardModule.lessons.length > 0, 'AI dashboard module should not be empty');
});

test('AI course production modules are not empty', () => {
  const aiCourse = COURSES_DATA.find(course => course.basicInfo?.slug === 'inteligencia-artificial');

  assert.ok(aiCourse, 'inteligencia-artificial course should exist');

  for (const moduleId of [3, 4, 5, 6]) {
    const module = aiCourse.curriculum.find(item => item.id === moduleId);

    assert.ok(module, `AI course module ${moduleId} should exist`);
    assert.ok(module.lessons.length > 0, `AI course module ${moduleId} should not be empty`);
  }
});
