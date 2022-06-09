/** Work around ad blockers that prevent opening links with `target="_blank"`.
 *
 * Notes:
 * - Usually ad blockers won't block all links, but it may on links like for Firebase Dynamic Links (with redirections I guess) (e.g. `https://example.page.link/?link=...`)
 * - Blockers watch windows/tabs being opened and close them a few millisecond after
 *
 * Advice: as much as you can prefer `_self` over `_blank` when possible.
 *
 * The workaround consists of replacing the target by `_self` if the tab is considered as closed after a tiny duration.
 */
export function workAroundPopUpBlockers(
  newWindow: Window,
  href: string,
  timeToWaitMilliseconds?: number
): void {
  setTimeout(() => {
    if (newWindow.closed) {
      window.open(href, '_self');
    }
  }, timeToWaitMilliseconds || 150);
}
