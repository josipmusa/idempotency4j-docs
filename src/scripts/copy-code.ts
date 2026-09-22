// The copy button on every code block. It is in the markup but hidden, because it is
// useless without script; a page with JavaScript off is a page of selectable code, which
// is the honest fallback.
//
// The same clipboard path as the coordinate panel: navigator.clipboard is undefined
// outside a secure context, which is every phone opening this over the LAN.

async function write(text: string): Promise<boolean> {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through */
    }
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

export function initCopyCode(): void {
  document.querySelectorAll<HTMLElement>('.code').forEach((block) => {
    if (block.dataset.wired) return;
    block.dataset.wired = 'true';
    const pre = block.querySelector('pre');
    if (!pre) return;

    // The bar and its button are in the markup from the build (src/plugins/code-bar.mjs);
    // the button is hidden until there is a script to make it do something.
    const button = block.querySelector<HTMLButtonElement>('.code__copy');
    if (!button) return;
    button.hidden = false;

    const status = document.createElement('span');
    status.className = 'visually-hidden';
    status.setAttribute('role', 'status');

    let reset = 0;
    button.addEventListener('click', async () => {
      if (!(await write(pre.textContent ?? ''))) return;
      window.clearTimeout(reset);
      button.dataset.copied = 'true';
      button.textContent = 'Copied';
      status.textContent = 'Copied to clipboard';
      reset = window.setTimeout(() => {
        delete button.dataset.copied;
        button.textContent = 'Copy';
        status.textContent = '';
      }, 1800);
    });

    block.append(status);
  });
}
