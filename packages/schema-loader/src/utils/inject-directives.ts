import { BREAK, parse, visit } from 'graphql';
import { normalizeSubgraphFromString } from '@wundergraph/composition';

export const injectDirectives = (schema: string) => {
  const { normalizationResult } = normalizeSubgraphFromString(schema, true);
  const isV2Graph = normalizationResult?.isVersionTwo || false;

  let hasDefinedLink = false;
  if (!isV2Graph) {
    return schema;
  }

  const usedDirectives = new Set<string>();

  visit(parse(schema), {
    Directive(node) {
      usedDirectives.add(node.name.value);
    },
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
    const alwaysImportDirectives = [
      '@composeDirective',
      '@extends',
      '@external',
      '@inaccessible',
      '@interfaceObject',
      '@override',
      '@provides',
      '@key',
      '@requires',
      '@shareable',
      '@tag',
    ];

    const conditionallyImportDirectives = [];

    if (usedDirectives.has('authenticated')) {
      conditionallyImportDirectives.push('@authenticated');
    }

    if (usedDirectives.has('requiresScopes')) {
      conditionallyImportDirectives.push('@requiresScopes');
    }

    const importDirectives = [...alwaysImportDirectives, ...conditionallyImportDirectives];

    const linkDirective = `extend schema
  @link(
    url: "https://specs.apollo.dev/federation/v2.5"
    import: [
      ${importDirectives.map((dir) => `"${dir}"`).join('\n      ')}
    ]
  )
`;

    return linkDirective + schema;
  }

  return schema;
};
