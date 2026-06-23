import fs from "node:fs";
import yaml from "js-yaml";

const content = JSON.parse(fs.readFileSync("content/site.json", "utf8"));
const config = yaml.load(fs.readFileSync("public/admin/config.yml", "utf8"));

function hasPath(value, parts) {
  if (parts.length === 0) return value !== undefined;
  const [part, ...rest] = parts;

  if (part === "*") {
    return Array.isArray(value) && value.length > 0 && value.every((item) => hasPath(item, rest));
  }

  return value != null && Object.prototype.hasOwnProperty.call(value, part) && hasPath(value[part], rest);
}

function collectFieldPaths(fields, prefix = [], inheritedOptional = false) {
  const paths = [];

  for (const field of fields ?? []) {
    const name = field.name;
    if (!name) continue;

    const optional = inheritedOptional || field.required === false;
    const next = [...prefix, name];

    if (field.widget === "object") {
      paths.push(...collectFieldPaths(field.fields, next, optional));
      continue;
    }

    if (field.widget === "list") {
      if (field.fields) {
        paths.push(...collectFieldPaths(field.fields, [...next, "*"], optional));
      } else if (field.field?.name) {
        paths.push({ path: [...next, "*"], optional });
      } else {
        paths.push({ path: next, optional });
      }
      continue;
    }

    paths.push({ path: next, optional });
  }

  return paths;
}

const fileEntries =
  config.collections?.flatMap((collection) => collection.files ?? []) ?? [];

const missing = [];

for (const file of fileEntries) {
  if (file.file !== "content/site.json") continue;
  for (const fieldPath of collectFieldPaths(file.fields)) {
    if (!fieldPath.optional && !hasPath(content, fieldPath.path)) {
      missing.push(fieldPath.path.join("."));
    }
  }
}

if (missing.length > 0) {
  console.error("CMS config points to missing required content paths:");
  for (const path of missing) console.error(`- ${path}`);
  process.exit(1);
}

console.log("CMS config required fields match content/site.json");
