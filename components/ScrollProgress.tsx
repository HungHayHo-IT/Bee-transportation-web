/** The thin page-wide progress bar; the hero engine drives its width. */
export function ScrollProgress() {
  return (
    <div className="scrollbar-progress" aria-hidden="true">
      <i id="pageProgress" />
    </div>
  );
}
