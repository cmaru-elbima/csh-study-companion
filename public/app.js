import { introductions, suggestions, demoReply, bookingMailto } from './demo.js';
const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
if (params.get('embedded') === '1') document.body.classList.add('embedded');
const endpoint = new URL(params.get('endpoint') || '/api/', location.href);
if (endpoint.origin !== location.origin) throw new Error('The assistant endpoint must be on this website.');
const apiURL = (path) => {
  const url = new URL(endpoint);
  if (url.searchParams.has('rest_route')) url.searchParams.set('rest_route', url.searchParams.get('rest_route').replace(/\/?$/, '/') + path);
  else url.pathname = url.pathname.replace(/\/?$/, '/') + path;
  return url;
};
let mode = 'explore', history = [], config = null, busy = false;
const log = $('#messages');
function bubble(text, role = 'assistant', error = false) {
  const div = document.createElement('div');
  div.className = `bubble ${role}${error ? ' error' : ''}`;
  div.textContent = text;
  log.append(div); log.scrollTop = log.scrollHeight;
  return div;
}
function refreshControls() {
  const ready = !!config && (config.mode === 'demo' || (config.mode === 'live' && $('#consent').checked));
  $('#send').disabled = !ready || busy;
  $('#question').disabled = !ready || busy;
  $('#reset').disabled = busy; $('#mode-select').disabled = busy;
  document.querySelectorAll('[data-mode]').forEach((b) => { b.disabled = busy; });
  document.querySelectorAll('.chip').forEach((b) => { b.disabled = !ready || busy; });
}
function changeMode(next) {
  if (busy || !Object.hasOwn(introductions, next)) return;
  mode = next; history = []; log.replaceChildren(); $('#mode-select').value = next;
  document.querySelectorAll('[data-mode]').forEach((button) => {
    const selected = button.dataset.mode === next;
    button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected));
  });
  bubble(introductions[next]); $('#prompts').replaceChildren();
  for (const text of suggestions[next]) {
    const button = document.createElement('button');
    button.className = 'chip'; button.type = 'button'; button.textContent = text;
    button.addEventListener('click', () => send(text)); $('#prompts').append(button);
  }
  refreshControls();
}
async function send(raw) {
  const text = raw.trim();
  if (!text || text.length > 1400 || busy || !config || config.mode === 'unavailable') return;
  if (config.mode === 'live' && !$('#consent').checked) return;
  busy = true; refreshControls(); $('#question').value = ''; bubble(text, 'user');
  const pending = bubble(config.mode === 'demo' ? 'Preparing a sample reply…' : 'Thinking about your question…');
  const messages = [...history, { role: 'user', content: text }].slice(-15);
  while (messages[0]?.role === 'assistant') messages.shift();
  try {
    let answer;
    if (config.mode === 'demo') answer = demoReply(text, mode);
    else {
      const response = await fetch(apiURL('chat'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit',
        body: JSON.stringify({ mode, messages, consent: true }), signal: AbortSignal.timeout(50000)
      });
      const data = await response.json();
      if (!response.ok || typeof data.answer !== 'string' || !data.answer.trim()) throw new Error(data.message || 'The assistant could not reply. Please try again or contact your adviser.');
      answer = data.answer;
    }
    pending.textContent = answer; history = [...messages, { role: 'assistant', content: answer }];
  } catch (error) {
    pending.classList.add('error');
    pending.textContent = error.name === 'TimeoutError' ? 'That reply took too long. Please try again or use WhatsApp to reach CSH.' : (error.message === 'Failed to fetch' ? 'The connection was interrupted. Please try again or contact CSH directly.' : error.message);
    $('#question').value = text;
  } finally {
    busy = false; refreshControls(); log.scrollTop = log.scrollHeight;
    if (!$('#question').disabled) $('#question').focus();
  }
}
document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => changeMode(button.dataset.mode)));
$('#mode-select').addEventListener('change', (event) => changeMode(event.target.value));
$('#reset').addEventListener('click', () => changeMode(mode));
$('#consent').addEventListener('change', refreshControls);
$('#chat-form').addEventListener('submit', (event) => { event.preventDefault(); send($('#question').value); });
$('#question').addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); send(event.target.value); } });
$('#consultation').addEventListener('click', () => {
  const now = new Date();
  $('#booking-form [name=date]').min = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  $('#timezone').value = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  $('#booking-result').textContent = ''; $('#booking').showModal();
});
$('#close-booking').addEventListener('click', () => $('#booking').close());
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !$('#booking').open && params.get('embedded') === '1') parent.postMessage({cshClose:true}, location.origin);
});
$('#booking-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const url = bookingMailto(Object.fromEntries(new FormData(event.target)));
  $('#booking-result').textContent = 'Email draft prepared. Review and send it in your email app. If it does not open, use the website enquiry form below. This does not confirm an appointment.';
  location.href = url;
});
changeMode('explore');
try {
  const response = await fetch(apiURL('config'), { credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('Configuration unavailable');
  config = await response.json();
  if (!['live', 'demo', 'unavailable'].includes(config.mode)) throw new Error('Invalid configuration');
  $('#status').textContent = config.mode === 'demo' ? 'Preview · sample replies' : config.mode === 'live' ? 'AI assistant' : 'Adviser support';
  $('#chat-subtitle').textContent = config.mode === 'demo' ? 'Preview · sample replies' : config.mode === 'live' ? 'AI guidance · your adviser is one step away' : 'Contact a CSH adviser';
  $('#consent-wrap').hidden = config.mode !== 'live';
  $('#disclosure').textContent = config.mode === 'demo' ? 'Preview uses scripted sample replies. Chat stays in this page and clears on reload.' : config.mode === 'live' ? 'AI can make mistakes. Chat text is sent to OpenAI for replies. Avoid sharing sensitive documents. CSH does not save chat transcripts through this add-on.' : 'AI chat is temporarily unavailable. You can still request a consultation or contact CSH.';
} catch {
  config = { mode: 'unavailable' }; $('#status').textContent = 'Adviser support';
  $('#disclosure').textContent = 'Chat is unavailable right now. Use the contact options above to reach CSH.';
}
refreshControls();
