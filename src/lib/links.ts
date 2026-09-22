// Every internal URL goes through here. The base path is Astro's, which comes from
// site.config.mjs, which derives it from the environment. Renaming the repository
// changes nothing in the source.
const base = import.meta.env.BASE_URL;

export function url(path: string): string {
  if (/^https?:/.test(path)) return path;
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`.replace(/\/$/, '') || '/';
}
