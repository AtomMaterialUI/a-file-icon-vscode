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
    if (['byName', 'colorByKey', 'colorLayers', 'layers'].includes(message.type)) {
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

  // ---------------------------------------------------------------- Colors tab

  const APPLY_TO = ['', 'dark', 'light', 'both'];
  const APPLY_LABELS = { '': 'applyAuto', both: 'applyBoth', dark: 'applyDark', light: 'applyLight' };

  const colorLabel = (/** @type {string} */ id) => {
    const theme = state.colors.themes.find((/** @type {any} */ item) => item.id === id);
    return theme ? theme.label : id;
  };

  /**
   * @param {string} selected
   * @param {string[]} exclude
   */
  const colorThemeSelect = (selected, exclude = []) => {
    const themes = state.colors.themes.filter((/** @type {any} */ theme) => !exclude.includes(theme.id));
    const ids = themes.map((/** @type {any} */ theme) => theme.id);
    if (selected && !ids.includes(selected)) ids.unshift(selected);
    return /** @type {HTMLSelectElement} */ (
      h('select', {}, ids.map((/** @type {string} */ id) => {
        const theme = state.colors.themes.find((/** @type {any} */ item) => item.id === id);
        return h('option', { selected: id === selected, text: theme ? `${theme.label} (${t(theme.kind)})` : id, value: id });
      }))
    );
  };

  const sendColorLayers = () =>
    send({
      layers: state.colors.layers.map((/** @type {any} */ l) => ({ ...(l.applyTo ? { applyTo: l.applyTo } : {}), syntax: l.syntax, theme: l.theme, ui: l.ui })),
      type: 'colorLayers',
    });
  const sendColorByKey = () => send({ byKey: state.colors.byKey, type: 'colorByKey' });

  /**
   * @param {number} index
   * @param {number} offset
   */
  const moveColorLayer = (index, offset) => {
    const [layer] = state.colors.layers.splice(index, 1);
    state.colors.layers.splice(index + offset, 0, layer);
    render();
    sendColorLayers();
  };

  const colorLayersSection = () => {
    const layers = state.colors.layers;
    const rows = layers.map((/** @type {any} */ layer, /** @type {number} */ index) =>
      h('tr', {}, [
        h('td', {}, [
          h('span', { text: layer.label }),
          layer.kind && h('span', { className: 'badge', text: t(layer.kind) }),
          !layer.installed && h('span', { className: 'badge', text: t('notInstalled') }),
        ]),
        h('td', {}, [modeSelect(layer.ui, (value) => { layer.ui = value; sendColorLayers(); }, t('ui'))]),
        h('td', {}, [modeSelect(layer.syntax, (value) => { layer.syntax = value; sendColorLayers(); }, t('syntax'))]),
        h('td', {}, [
          h(
            'select',
            {
              onChange: (/** @type {Event} */ event) => {
                layer.applyTo = /** @type {HTMLSelectElement} */ (event.target).value || undefined;
                sendColorLayers();
              },
              title: t('applyTo'),
            },
            APPLY_TO.map((value) => h('option', { selected: (layer.applyTo || '') === value, text: t(/** @type {any} */ (APPLY_LABELS)[value]), value })),
          ),
        ]),
        h('td', { className: 'actions' }, [
          button('↑', () => moveColorLayer(index, -1), { disabled: index === 0, title: t('moveUp') }),
          button('↓', () => moveColorLayer(index, 1), { disabled: index === layers.length - 1, title: t('moveDown') }),
          button('✕', () => { layers.splice(index, 1); render(); sendColorLayers(); }, { title: t('remove') }),
        ]),
      ]),
    );

    const used = layers.map((/** @type {any} */ layer) => layer.theme);
    const available = state.colors.themes.filter((/** @type {any} */ theme) => !used.includes(theme.id));
    const select = available.length > 0 ? colorThemeSelect(available[0].id, used) : undefined;

    return h('section', {}, [
      h('h2', { text: t('colorLayers') }),
      h('p', { className: 'hint', text: t('colorLayersHint') }),
      layers.length > 0
        ? h('table', { className: 'layers' }, [
          h('thead', {}, [h('tr', {}, [h('th', { text: '' }), h('th', { text: t('ui') }), h('th', { text: t('syntax') }), h('th', { text: t('applyTo') }), h('th', { text: '' })])]),
          h('tbody', {}, rows),
        ])
        : h('p', { className: 'empty', text: t('noColorLayers') }),
      select
        ? h('div', { className: 'add' }, [
          select,
          button(t('addLayer'), () => {
            const theme = state.colors.themes.find((/** @type {any} */ item) => item.id === select.value);
            layers.push({ installed: true, kind: theme && theme.kind, label: colorLabel(select.value), syntax: 'fill', theme: select.value, ui: 'fill' });
            render();
            sendColorLayers();
          }),
        ])
        : state.colors.themes.length === 0 && h('p', { className: 'empty', text: t('noColorThemes') }),
    ]);
  };

  const colorByKeySection = () => {
    const entries = state.colors.byKey;
    const rows = entries.map((/** @type {any} */ entry, /** @type {number} */ index) => {
      const select = colorThemeSelect(entry.theme);
      select.addEventListener('change', () => { entry.theme = select.value; sendColorByKey(); });
      return h('tr', {}, [
        h('td', {}, [h('code', { text: entry.key })]),
        h('td', {}, [select]),
        h('td', { className: 'actions' }, [button('✕', () => { entries.splice(index, 1); render(); sendColorByKey(); }, { title: t('remove') })]),
      ]);
    });

    const input = /** @type {HTMLInputElement} */ (h('input', { placeholder: t('keyPlaceholder'), type: 'text' }));
    const select = state.colors.themes.length > 0 ? colorThemeSelect(state.colors.themes[0].id) : undefined;
    const add = () => {
      const key = input.value.trim();
      if (!key || !select) return;
      state.colors.byKey = entries.filter((/** @type {any} */ entry) => entry.key !== key);
      state.colors.byKey.push({ key, theme: select.value });
      render();
      sendColorByKey();
    };
    input.addEventListener('keydown', (event) => { if (event.key === 'Enter') add(); });

    return h('section', {}, [
      h('h2', { text: t('colorByKey') }),
      h('p', { className: 'hint', text: t('colorByKeyHint') }),
      entries.length > 0 ? h('table', { className: 'by-name' }, [h('tbody', {}, rows)]) : h('p', { className: 'empty', text: t('noColorByKey') }),
      select && h('div', { className: 'add' }, [input, select, button(t('add'), add)]),
    ]);
  };

  const colorPreviewSection = () => {
    const columns = state.colors.preview;
    const head = h('tr', {}, [h('th', { text: '' }), ...columns.map((/** @type {any} */ column) => h('th', { className: column.id === 'result' ? 'result' : undefined, text: column.label }))]);
    const swatchRows = state.colors.previewColors.map((/** @type {string} */ key) =>
      h('tr', {}, [
        h('td', { className: 'name' }, [h('code', { text: key })]),
        ...columns.map((/** @type {any} */ column) => {
          const value = column.colors[key];
          const swatch = h('span', { className: value ? 'swatch' : 'swatch none', title: value || '–' });
          if (value) swatch.style.background = value;
          return h('td', { className: column.id === 'result' ? 'result' : undefined }, [swatch, h('span', { className: 'hex', text: value || '–' })]);
        }),
      ]),
    );
    const codeRow = h('tr', {}, [
      h('td', { className: 'name' }, [h('code', { text: 'Python' })]),
      ...columns.map((/** @type {any} */ column) => {
        const block = h('pre', { className: 'code' }, column.code.map((/** @type {any[]} */ line) =>
          h('div', {}, line.map((part) => {
            const span = h('span', { text: part.text });
            if (part.foreground) span.style.color = part.foreground;
            if (part.fontStyle && part.fontStyle.includes('italic')) span.style.fontStyle = 'italic';
            if (part.fontStyle && part.fontStyle.includes('bold')) span.style.fontWeight = 'bold';
            if (part.fontStyle && part.fontStyle.includes('underline')) span.style.textDecoration = 'underline';
            return span;
          })),
        ));
        if (column.colors['editor.background']) block.style.background = column.colors['editor.background'];
        if (column.colors['editor.foreground']) block.style.color = column.colors['editor.foreground'];
        return h('td', { className: column.id === 'result' ? 'result' : undefined }, [block]);
      }),
    ]);

    return h('section', {}, [
      h('h2', { text: t('colorPreview') }),
      h('p', { className: 'hint', text: t('colorPreviewHint') }),
      h('div', { className: 'table-scroll' }, [h('table', { className: 'preview colors' }, [h('thead', {}, [head]), h('tbody', {}, [codeRow, ...swatchRows])])]),
    ]);
  };

  // ---------------------------------------------------------------- Page

  /** @type {'colors' | 'icons'} */
  let tab = (vscode.getState() && vscode.getState().tab) || 'icons';

  const tabs = () =>
    h('div', { className: 'tabs', role: 'tablist' }, [
      ['icons', 'tabIcons'],
      ['colors', 'tabColors'],
    ].map(([id, key]) =>
      h('button', {
        'aria-selected': String(tab === id),
        className: tab === id ? 'tab selected' : 'tab',
        onClick: () => { tab = /** @type {any} */ (id); vscode.setState({ tab }); render(); },
        role: 'tab',
        text: t(key),
        type: 'button',
      }),
    ));

  const render = () => {
    const open = app.querySelector('details')?.open;
    const children = tab === 'colors'
      ? [
        h('h1', {}, [t('title'), h('span', { className: 'applying', text: t('applying') })]),
        tabs(),
        state.colorActive ? undefined : h('p', { className: 'warning', text: t('colorInactive') }),
        colorLayersSection(),
        colorByKeySection(),
        colorPreviewSection(),
      ]
      : [
        h('h1', {}, [t('title'), h('span', { className: 'applying', text: t('applying') })]),
        tabs(),
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
    if (message?.type === 'tab' && (message.tab === 'colors' || message.tab === 'icons')) {
      tab = message.tab;
      vscode.setState({ tab });
      if (state) render();
      return;
    }
    if (message?.type !== 'state') return;
    state = message.state;
    clearTimeout(pendingTimer);
    document.body.classList.remove('pending');
    loadFonts(state.fonts);
    render();
  });

  send({ type: 'ready' });
})();
