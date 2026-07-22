import assert from 'node:assert/strict';
import test from 'node:test';
import { buildTrackedUrl, captureAttribution, classifySource, getAnalyticsPageLocation, getAnalyticsReferrer, sanitizeEvent } from '../src/lib/attribution.mjs';

test('captures canonical UTM values and strips unrelated query data', () => {
  const attribution = captureAttribution({ pageUrl: 'https://peterghiorse.com/resume?utm_source=LinkedIn&utm_medium=Social&utm_campaign=Recruiter_Visibility&utm_content=Featured_Resume&email=person@example.com' });
  assert.deepEqual(attribution, { source_channel: 'linkedin', source_name: 'linkedin', source_medium: 'social', campaign_name: 'recruiter_visibility', link_placement: 'featured_resume', landing_path: '/resume', referrer_host: '(none)' });
  assert.ok(!JSON.stringify(attribution).includes('person'));
});

test('preserves a valid first-touch record for the session', () => {
  const stored = { source_channel: 'github', source_name: 'github', source_medium: 'referral', campaign_name: 'recruiter_visibility', link_placement: 'readme_badge', landing_path: '/', referrer_host: 'github.com' };
  assert.deepEqual(captureAttribution({ pageUrl: 'https://peterghiorse.com/blog?utm_source=substack&utm_medium=email&utm_campaign=content_distribution&utm_content=issue_1', stored }), stored);
});

test('stores only an external referrer hostname', () => {
  const attribution = captureAttribution({ pageUrl: 'https://peterghiorse.com/about', referrer: 'https://chatgpt.com/c/share-id?email=person@example.com' });
  assert.equal(attribution.source_channel, 'ai_assistant');
  assert.equal(attribution.source_name, 'chatgpt.com');
  assert.equal(attribution.referrer_host, 'chatgpt.com');
  assert.equal(getAnalyticsReferrer(attribution), 'https://chatgpt.com/');
});

test('classifies controlled channel families', () => {
  assert.equal(classifySource('(direct)', '(none)'), 'direct');
  assert.equal(classifySource('google', 'referral', 'google.com'), 'organic_search');
  assert.equal(classifySource('newsletter', 'email'), 'direct_outreach');
  assert.equal(classifySource('linkedin', 'social'), 'linkedin');
});

test('sanitizes allow-listed events and parameters only', () => {
  const event = sanitizeEvent('contact_intent', { contact_method: 'Email', placement: 'Resume Intro', content_path: '/resume?person=someone', email: 'person@example.com', arbitrary: 'secret' }, { source_channel: 'linkedin', source_name: 'linkedin' });
  assert.deepEqual(event, { name: 'contact_intent', parameters: { source_channel: 'linkedin', source_name: 'linkedin', contact_method: 'email', placement: 'resume_intro', content_path: '/resume' } });
  assert.equal(sanitizeEvent('identify_person', { email: 'person@example.com' }), null);
});

test('reconstructs a GA page location with aggregate UTMs only', () => {
  const attribution = captureAttribution({ pageUrl: 'https://peterghiorse.com/resume?utm_source=linkedin&utm_medium=social&utm_campaign=recruiter_visibility&utm_content=featured_resume&person=pete' });
  assert.equal(getAnalyticsPageLocation({ path: '/resume?person=pete', attribution }), 'https://peterghiorse.com/resume?utm_source=linkedin&utm_medium=social&utm_campaign=recruiter_visibility&utm_content=featured_resume');
});

test('builds controlled aggregate links', () => {
  assert.equal(buildTrackedUrl({ path: '/resume', source: 'LinkedIn', medium: 'Social', campaign: 'Recruiter Visibility', content: 'Featured Resume' }), 'https://peterghiorse.com/resume?utm_source=linkedin&utm_medium=social&utm_campaign=recruiter_visibility&utm_content=featured_resume');
});
