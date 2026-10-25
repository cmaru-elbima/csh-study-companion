(() => {
  if (!window.CSHWidget?.url || document.getElementById('csh-chat-launcher')) return;
  const source = new URL(window.CSHWidget.url, location.href);
  if (source.origin !== location.origin) return;
  const style = document.createElement('style');
  style.textContent = '#csh-chat-launcher{position:fixed;left:20px;bottom:20px;z-index:99999;background:#13233a;color:white;border:1px solid #53647d;border-radius:28px;padding:14px 20px;font:600 14px system-ui;cursor:pointer;box-shadow:0 5px 25px #13233a30}#csh-chat-tray{position:fixed;left:20px;bottom:82px;z-index:99999;width:min(430px,calc(100vw - 40px));height:min(690px,calc(100dvh - 110px));border:1px solid #c8d2e3;border-radius:18px;overflow:hidden;background:white;box-shadow:0 14px 60px #13233a35}#csh-chat-tray[hidden]{display:none}#csh-chat-tray iframe{border:0;width:100%;height:calc(100% - 32px)}#csh-chat-close{display:block;width:100%;height:32px;text-align:right;padding:4px 15px;border:0;background:#edf1f8;color:#233957;font:12px system-ui;cursor:pointer}#csh-chat-launcher:focus-visible,#csh-chat-close:focus-visible{outline:3px solid #b58c49;outline-offset:3px}';
  document.head.append(style);
  const launcher = document.createElement('button'); launcher.id = 'csh-chat-launcher'; launcher.type = 'button'; launcher.textContent = '✦ Ask CSH'; launcher.setAttribute('aria-expanded', 'false'); launcher.setAttribute('aria-controls', 'csh-chat-tray');
  const tray = document.createElement('section'); tray.id = 'csh-chat-tray'; tray.hidden = true; tray.setAttribute('aria-label', 'CSH study assistant');
  const close = document.createElement('button'); close.id = 'csh-chat-close'; close.type = 'button'; close.textContent = 'Close chat ×';
  const iframe = document.createElement('iframe'); iframe.title = 'CSH Study Companion'; iframe.referrerPolicy = 'same-origin';
  tray.append(close, iframe); document.body.append(tray, launcher);
  const toggle = (open) => { tray.hidden = !open; launcher.setAttribute('aria-expanded', String(open)); if (open) { if (!iframe.src) iframe.src = source.href; close.focus(); } else launcher.focus(); };
  launcher.addEventListener('click', () => toggle(tray.hidden)); close.addEventListener('click', () => toggle(false));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !tray.hidden) toggle(false); });
  window.addEventListener('message', (event) => { if (event.origin === location.origin && event.source === iframe.contentWindow && event.data?.cshClose === true) toggle(false); });
})();
