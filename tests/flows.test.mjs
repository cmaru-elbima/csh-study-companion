import test from 'node:test';
import assert from 'node:assert/strict';
import { demoReply, bookingMailto, introductions, suggestions } from '../public/demo.js';

test('all three visitor paths offer an introduction and working prompts', () => {
  for (const mode of ['explore','consult','support']) {
    assert.ok(introductions[mode].length > 50);
    assert.equal(suggestions[mode].length,3);
    for (const prompt of suggestions[mode]) assert.ok(demoReply(prompt,mode).length > 50);
  }
});
test('existing client status is referred to an adviser without fabricated records', () => {
  assert.match(demoReply('Check my application status','support'), /isn't connected to student records/);
});
test('appointments are clearly unconfirmed requests', () => {
  assert.match(demoReply('Is my appointment confirmed?','consult'), /not a confirmed appointment/);
});
test('visa guarantees and unsupported pricing are not invented', () => {
  assert.match(demoReply('Can you guarantee a visa?','explore'), /No outcome can be guaranteed/);
  assert.match(demoReply('What are your fees?','explore'), /don't have an approved price list/);
});
test('email handoff preserves time zone and safely encodes user text', () => {
  const values={name:'Test & Person',email:'test@example.com',date:'2026-12-03',time:'10:30',timezone:'Africa/Accra',topic:'Scholarships & fees? #study'};
  const url=new URL(bookingMailto(values));
  assert.equal(url.protocol,'mailto:');
  assert.equal(url.pathname,'studyabroad@cshconsultancy.com');
  assert.equal(url.searchParams.size,2);
  assert.ok(url.searchParams.get('body').includes('Time zone: Africa/Accra'));
  assert.ok(url.searchParams.get('body').includes(values.topic));
  assert.ok(url.searchParams.get('body').includes('not a confirmed booking'));
});
