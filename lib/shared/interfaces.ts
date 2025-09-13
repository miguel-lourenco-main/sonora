/**
 * Interfaces for the shared package
 * 
 * Guidelines for defining interfaces here:
 * 1. The interface must be shared between multiple packages
 * 2. The interface should be used by this package
 * 
 * Note: Due to Turborepo's parallel compilation behavior, interfaces should be defined
 * in packages that are dependencies of their consumers, not the other way around.
 * Packages compile in parallel unless they have explicit dependencies on each other.
 * 
 * If an interface doesn't meet these requirements, consider placing it in a more
 * appropriate package.
 */