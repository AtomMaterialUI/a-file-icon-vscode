// @ts-check
// Page of the theme mixer (src/panels/ThemeMixerPanel.ts). The extension sends the whole state; every change is sent
// back as the new value of a setting, and the extension answers with the new state once the theme is regenerated.
(function () {
  // eslint-disable-next-line no-undef
  const vscode = acquireVsCodeApi();
  const app = /** @type {HTMLElement} */ (document.getElementById('app'));
  const fontStyle = document.createElement('style');
  document.head.append(fontStyle);

  /** @type {any} */
  let state;
  const MODES = ['fill', 'override', 'off'];

  const t = (/** @type {string} */ key) => (state && state.strings[key]) || key;

  /**
   * @param {string} tag
   * @param {Record<string, any>} [props]
   * @param {Array<Node | string | null | undefined | false>} [children]
   */
  const h = (tag, props = {}, children = []) => {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value === undefined || value === null || value === false) continue;
      if (key === 'className') element.className = value;
      else if (key === 'text') element.textContent = value;
      else if (key.startsWith('on')) element.addEventListener(key.slice(2).toLowerCase(), value);
      else if (key in element && key !== 'list') /** @type {any} */ (element)[key] = value;
      else element.setAttribute(key, String(value));
    }
    for (const child of children) {
      if (child !== null && child !== undefined && child !== false) element.append(child);
    }
    return element;
  };

  /** A setting was written: the theme is being regenerated until the next state (or a while, if nothing changed) */
  let pendingTimer = 0;

  const send = (/** @type {any} */ message) => {
    if (message.type === 'layers' || message.type === 'byName') {
      document.body.classList.add('pending');
      clearTimeout(pendingTimer);
      pendingTimer = setTimeout(() => document.body.classList.remove('pending'), 30_000);
    }
    vscode.postMessage(message);
  };

  const sendLayers = () =>
    send({ layers: state.layers.map((/** @type {any} */ l) => ({ files: l.files, folders: l.folders, theme: l.theme })), type: 'layers' });
  const sendByName = () => send({ byName: state.byName, type: 'byName' });

  const label = (/** @type {string} */ id) => {
    const theme = state.themes.find((/** @type {any} */ item) => item.id === id);
    return theme ? theme.label : id;
  };

  /** @param {any} icon */
  const iconElement = (icon) => {
    if (!icon) return h('span', { className: 'icon none', text: '–' });
    if (icon.kind === 'image' && icon.currentColor) {
      // drawn with the color of the text, as VS Code does for the themes with `usesCurrentColor`
      const mask = h('span', { className: 'icon mask' });
      mask.style.maskImage = `url("${icon.src}")`;
      return mask;
    }
    if (icon.kind === 'image') return h('img', { alt: '', className: 'icon', src: icon.src });

    const glyph = h('span', { className: 'icon glyph', text: icon.character });
    glyph.style.fontFamily = `"afi-${icon.font}"`;
    glyph.style.fontSize = icon.size;
    if (icon.color) glyph.style.color = icon.color;
    return glyph;
  };

  /**
   * @param {string} value
   * @param {(value: string) => void} onChange
   * @param {string} title
   */
  const modeSelect = (value, onChange, title) =>
    h(
      'select',
      { onChange: (/** @type {Event} */ event) => onChange(/** @type {HTMLSelectElement} */ (event.target).value), title },
      MODES.map((mode) =>
        h('option', {
          selected: mode === value,
          text: t(`mode${mode[0].toUpperCase()}${mode.slice(1)}`),
          value: mode,
        }),
      ),
    );

  /**
   * @param {string} selected
   * @param {string[]} exclude
   */
  const themeSelect = (selected, exclude = []) => {
    const ids = state.themes.map((/** @type {any} */ theme) => theme.id).filter((/** @type {string} */ id) => !exclude.includes(id));
    if (selected && !ids.includes(selected)) ids.unshift(selected);
    return /** @type {HTMLSelectElement} */ (
      h('select', {}, ids.map((/** @type {string} */ id) => h('option', { selected: id === selected, text: label(id), value: id })))
    );
  };

  const button = (/** @type {string} */ text, /** @type {() => void} */ onClick, /** @type {Record<string, any>} */ props = {}) =>
    h('button', { onClick, text, type: 'button', ...props });

  const layersSection = () => {
    const rows = state.layers.map((/** @type {any} */ layer, /** @type {number} */ index) =>
      h('tr', {}, [
        h('td', {}, [
          h('span', { text: layer.label }),
          !layer.installed && h('span', { className: 'badge', text: t('notInstalled') }),
        ]),
        h('td', {}, [modeSelect(layer.files, (value) => { layer.files = value; sendLayers(); }, t('files'))]),
        h('td', {}, [modeSelect(layer.folders, (value) => { layer.folders = value; sendLayers(); }, t('folders'))]),
        h('td', { className: 'actions' }, [
          button('↑', () => { move(index, -1); }, { disabled: index === 0, title: t('moveUp') }),
          button('↓', () => { move(index, 1); }, { disabled: index === state.layers.length - 1, title: t('moveDown') }),
          button('✕', () => { state.layers.splice(index, 1); render(); sendLayers(); }, { title: t('remove') }),
        ]),
      ]),
    );

    const used = state.layers.map((/** @type {any} */ layer) => layer.theme);
    const available = state.themes.filter((/** @type {any} */ theme) => !used.includes(theme.id));
    const select = available.length > 0 ? themeSelect(available[0].id, used) : undefined;

    return h('section', {}, [
      h('h2', { text: t('layers') }),
      h('p', { className: 'hint', text: t('layersHint') }),
      state.layers.length > 0
        ? h('table', { className: 'layers' }, [
          h('thead', {}, [h('tr', {}, [h('th', { text: '' }), h('th', { text: t('files') }), h('th', { text: t('folders') }), h('th', { text: '' })])]),
          h('tbody', {}, rows),
        ])
        : h('p', { className: 'empty', text: t('noLayers') }),
      select
        ? h('div', { className: 'add' }, [
          select,
          button(t('addLayer'), () => {
            state.layers.push({ files: 'fill', folders: 'fill', installed: true, label: label(select.value), theme: select.value });
            render();
            sendLayers();
          }),
        ])
        : state.themes.length === 0 && h('p', { className: 'empty', text: t('noThemes') }),
    ]);
  };

  /**
   * @param {number} index
   * @param {number} offset
   */
  const move = (index, offset) => {
    const [layer] = state.layers.splice(index, 1);
    state.layers.splice(index + offset, 0, layer);
    render();
    sendLayers();
  };

  const byNameSection = () => {
    const rows = state.byName.map((/** @type {any} */ entry, /** @type {number} */ index) => {
      const select = themeSelect(entry.theme);
      select.addEventListener('change', () => { entry.theme = select.value; sendByName(); });
      return h('tr', {}, [
        h('td', {}, [h('code', { text: entry.key })]),
        h('td', {}, [select]),
        h('td', { className: 'actions' }, [
          button('✕', () => { state.byName.splice(index, 1); render(); sendByName(); }, { title: t('remove') }),
        ]),
      ]);
    });

    const input = /** @type {HTMLInputElement} */ (h('input', { placeholder: t('namePlaceholder'), type: 'text' }));
    const select = state.themes.length > 0 ? themeSelect(state.themes[0].id) : undefined;
    const add = () => {
      const key = input.value.trim();
      if (!key || !select) return;
      state.byName = state.byName.filter((/** @type {any} */ entry) => entry.key.toLowerCase() !== key.toLowerCase());
      state.byName.push({ key, theme: select.value });
      render();
      sendByName();
    };
    input.addEventListener('keydown', (event) => { if (event.key === 'Enter') add(); });

    return h('section', {}, [
      h('h2', { text: t('byName') }),
      h('p', { className: 'hint', text: t('byNameHint') }),
      state.byName.length > 0 ? h('table', { className: 'by-name' }, [h('tbody', {}, rows)]) : h('p', { className: 'empty', text: t('noByName') }),
      select && h('div', { className: 'add' }, [input, select, button(t('add'), add)]),
    ]);
  };

  /** @param {string} name */
  const togglePin = (name, /** @type {string} */ theme) => {
    const index = state.byName.findIndex((/** @type {any} */ entry) => entry.key.trim().toLowerCase() === name.toLowerCase());
    if (index !== -1 && state.byName[index].theme === theme) state.byName.splice(index, 1);
    else if (index === -1) state.byName.push({ key: name, theme });
    else state.byName[index].theme = theme;
    render();
    sendByName();
  };

  const previewSection = () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (h('textarea', { rows: 6, spellcheck: false, value: state.samples.join('\n') }));
    const columns = state.columns;

    const head = h('tr', {}, [
      h('th', { text: t('name') }),
      h('th', { className: 'result', text: t('result') }),
      ...columns.map((/** @type {any} */ column) => h('th', { text: column.label, title: column.id })),
    ]);
    const rows = state.rows.map((/** @type {any} */ row) =>
      h('tr', {}, [
        h('td', { className: 'name' }, [h('code', { text: row.name })]),
        h('td', { className: 'result' }, [iconElement(row.result)]),
        ...columns.map((/** @type {any} */ column) => {
          const pinned = row.pinned === column.id;
          const icon = row.icons[column.id];
          return h('td', {}, [
            icon
              ? h('button', {
                className: pinned ? 'cell pinned' : 'cell',
                onClick: () => togglePin(row.name, column.id),
                title: `${pinned ? t('unpin') : t('pin')}: ${row.name} → ${column.label}`,
                type: 'button',
              }, [iconElement(icon)])
              : iconElement(null),
          ]);
        }),
      ]),
    );

    return h('section', {}, [
      h('h2', { text: t('preview') }),
      h('p', { className: 'hint', text: t('previewHint') }),
      h('div', { className: 'table-scroll' }, [h('table', { className: 'preview' }, [h('thead', {}, [head]), h('tbody', {}, rows)])]),
      h('details', {}, [
        h('summary', { text: t('samples') }),
        h('p', { className: 'hint', text: t('samplesHint') }),
        textarea,
        h('div', { className: 'add' }, [
          button(t('updateSamples'), () => send({ samples: textarea.value.split(/\r?\n/), type: 'samples' })),
          button(t('workspaceSamples'), () => send({ type: 'workspaceSamples' })),
          button(t('defaultSamples'), () => send({ type: 'defaultSamples' })),
        ]),
      ]),
    ]);
  };

  const render = () => {
    const open = app.querySelector('details')?.open;
    const children = [
      h('h1', {}, [t('title'), h('span', { className: 'applying', text: t('applying') })]),
      state.active ? undefined : h('p', { className: 'warning', text: t('inactive') }),
      layersSection(),
      byNameSection(),
      previewSection(),
    ];
    app.replaceChildren(...children.filter((child) => child !== undefined));
    const details = app.querySelector('details');
    if (details && open) details.open = true;
  };

  /** @param {any[]} fonts */
  const loadFonts = (fonts) => {
    fontStyle.textContent = fonts
      .map((font) => `@font-face { font-family: "${font.family}"; src: ${font.src}; font-style: ${font.style}; font-weight: ${font.weight}; }`)
      .join('\n');
  };

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (message?.type !== 'state') return;
    state = message.state;
    clearTimeout(pendingTimer);
    document.body.classList.remove('pending');
    loadFonts(state.fonts);
    render();
  });

  send({ type: 'ready' });
})();
