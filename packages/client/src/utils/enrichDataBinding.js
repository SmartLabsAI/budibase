import { Helpers } from "@budibase/bbui"
import { processObjectSync } from "@budibase/string-templates"
import { snippets } from "../stores"
import { get } from "svelte/store"

/**
 * Recursively enriches all props in a props object and returns the new props.
 * Props are deeply cloned so that no mutation is done to the source object.
 */
export const enrichDataBindings = (props, context) => {
  const totalContext = { ...context, snippets: get(snippets) }
  const opts = { cache: true }
  return processObjectSync(Helpers.cloneDeep(props), totalContext, opts)
}
