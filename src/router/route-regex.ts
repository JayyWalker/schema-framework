/**
 * Converts Human-readable constraint to a regex
 * @param humanConstraint
 */
export function convertParameterConstraint (humanConstraint: string): string {
  switch(humanConstraint) {
    case('int'):
    case('integer'):
      return '\\d+'
    case('unknown'):
      return '.+'
    default:
      throw new ParameterConstraintError(`Unrecognised field type provided as parameter constraint: ${humanConstraint}`)
  }
}

export function parameterToRegex (routeSegments: string) {
  // Checks if the segment is a parameter. If not, it is returned as normal
  if (routeSegments.indexOf('{') < 0) {
    return routeSegments
  }

  const parameter: string[] = routeSegments
    .substring(1, (routeSegments.length - 1))
    .split(':')

  const [parameterName, constraint] = parameter

  const parameterConstraintRegex: string = parameter.length === 2
    // A constraint is provided
    ? convertParameterConstraint(constraint)
    // When no constraint is provided
    : convertParameterConstraint('unknown')

  return `(?<${parameterName}>${parameterConstraintRegex})`
}

export function createRouteRegex(routePath: string): string {
  let result = routePath
    .split('/')
    .map(parameterToRegex)
    .join('\\/')

  if (!result.endsWith('/')) {
    result = `${result}\\/`
  }

  return `^${result}$`
}

export class ParameterConstraintError extends Error {}
