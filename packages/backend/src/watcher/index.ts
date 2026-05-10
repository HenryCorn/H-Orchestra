import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';
import chokidar, { type FSWatcher } from 'chokidar';
import { debounce } from './debounce.js';
import { getWatchOptions } from './platform.js';
import { IGNORED_PATTERNS } from '@h-orchestra/shared';
import type { ParserRegistry } from '../parsers/index.js';

export class HarnessWatcher extends EventEmitter {
  private watcher: FSWatcher | null = null;

  constructor(
    private readonly mountPath: string,
    private readonly usePollingEnv: boolean,
    private readonly registry: ParserRegistry
  ) {
    super();
  }

  start(): void {
    const { usePolling, interval } = getWatchOptions(this.usePollingEnv);

    this.watcher = chokidar.watch(this.mountPath, {
      persistent: true,
      usePolling,
      interval,
      awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 },
      ignored: IGNORED_PATTERNS,
    });

    const debouncedHandle = debounce(
      (eventType: string, filePath: string) => void this.handleChange(eventType, filePath),
      50
    );

    this.watcher
      .on('add', (p) => debouncedHandle('add', p))
      .on('change', (p) => debouncedHandle('change', p))
      .on('unlink', (p) => debouncedHandle('unlink', p))
      .on('error', (err: unknown) => {
        const e = err as Error & { code?: string };
        if (e.code === 'EMFILE') {
          console.warn(
            '[H-Orchestra] Watcher hit EMFILE limit. ' +
            'Increase fs.inotify.max_user_watches or switch to polling mode ' +
            '(CHOKIDAR_USEPOLLING=true).'
          );
        } else {
          console.error('[H-Orchestra] Watcher error:', e.message);
        }
      });
  }

  private async handleChange(eventType: string, filePath: string): Promise<void> {
    this.emit('file:changed', { path: filePath, eventType, timestamp: new Date().toISOString() });

    const parser = this.registry.findParser(filePath);
    if (!parser) return;

    const content = await readFile(filePath, 'utf-8').catch(() => null);
    if (content === null) return;

    try {
      const parsed = parser.parse(filePath, content);
      this.emit(parser.eventType, parsed);
    } catch (err) {
      this.emit('parse:error', { path: filePath, error: err });
    }
  }

  async stop(): Promise<void> {
    await this.watcher?.close();
  }
}
