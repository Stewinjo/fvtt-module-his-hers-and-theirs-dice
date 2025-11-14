import yaml from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm";

export async function readYAML(filepath) {
  const response = await fetch(filepath);

  if (!response.ok) {
    throw new Error(`Failed to load YAML file at ${filepath}: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const parsed = yaml.load(text);

  if (!parsed || !Array.isArray(parsed.themes)) {
    return [];
  }

  return parsed.themes;
}
