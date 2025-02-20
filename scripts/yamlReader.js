import yaml from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm";

export async function readYAML(filepath) {
  const response = await fetch(filepath);
  const text = await response.text();
  return yaml.load(text).themes;
}
