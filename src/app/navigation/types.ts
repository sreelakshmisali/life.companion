export type TabId = 'home' | 'missions' | 'meditate' | 'settings';

/**
 * Screens that aren't tabs of their own (per the spec: Todo, Meditation,
 * and the water/mood trends view all live "inside" a tab, reached by
 * tapping into them) render as a full-screen overlay on top of whichever
 * tab is currently active, rather than switching tabs themselves.
 */
export type OverlayId = 'meditation' | 'insights' | 'todos' | 'onThisDay' | null;

/** Height reserved at the bottom of scrollable tab screens so content
 * never sits underneath the floating tab bar. */
export const TAB_BAR_CLEARANCE = 96;
