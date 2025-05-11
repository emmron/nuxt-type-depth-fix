# Fix for 'Type instantiation is excessively deep and possibly infinite' error in Nitro config

This PR addresses the TypeScript error when using nitro.rollupConfig.plugins by adding a dedicated NitroRollupConfig interface that breaks the recursive type dependency.
