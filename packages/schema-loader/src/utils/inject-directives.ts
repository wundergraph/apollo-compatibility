import { BREAK, parse, visit } from 'graphql';
import { normalizeSubgraphFromString } from '@wundergraph/composition';

export const injectDirectives = (schema: string) => {
  const { normalizationResult } = normalizeSubgraphFromString(schema, true);
  const isV2Graph = normalizationResult?.isVersionTwo || false;

  const linkDirective = `extend schema
  @link(
    url: "https://specs.apollo.dev/federation/v2.5"
    import: [
      "@authenticated"
      "@composeDirective"
      "@extends"
      "@external"
      "@inaccessible"
      "@interfaceObject"
      "@override"
      "@provides"
      "@key"
      "@requires"
      "@requiresScopes"
      "@shareable"
      "@tag"
    ]
  )
`;
  let hasDefinedLink = false;
  if (!isV2Graph) {
    return schema;
  }
  visit(parse(schema), {
    SchemaDefinition: {
      enter(node) {
        if (!node.directives) {
          return false;
        }
        for (const directive of node.directives) {
          if (directive.name.value === 'link') {
            hasDefinedLink = true;
            return BREAK;
          }
        }
        return false;
      },
    },
    SchemaExtension: {
      enter(node) {
        if (!node.directives) {
          return false;
        }
        for (const directive of node.directives) {
          if (directive.name.value === 'link') {
            hasDefinedLink = true;
            return BREAK;
          }
        }
        return false;
      },
    },
  });

  if (!hasDefinedLink) {
    return linkDirective + schema;
  }
  return schema;
};
