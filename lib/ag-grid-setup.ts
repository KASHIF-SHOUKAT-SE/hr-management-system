/**
 * AG Grid Global Configuration
 * 
 * Centralizes AG Grid module registration so it only happens once,
 * preventing duplicate registrations across components.
 */
import {
  AllCommunityModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";

// Register modules once at app level
ModuleRegistry.registerModules([AllCommunityModule]);

// Enable development-time validation warnings (stripped in production)
if (process.env.NODE_ENV !== "production") {
  ModuleRegistry.registerModules([ValidationModule]);
}
