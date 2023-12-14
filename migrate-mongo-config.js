const config = {
    mongodb: {
        url: `mongodb://${process.env.MG_USER || "root"}:${process.env.MG_PASS || "root"}@${process.env.MG_HOST || "127.0.0.1"}:${
            process.env.MG_PORT || 27017
        }`,
        databaseName: process.env.DB_NAME || "MERLIN",
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
    migrationsDir: "migrations/migration-files",

    // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
    changelogCollectionName: "changelog",

    // The file extension to create migrations and search for in migration dir
    migrationFileExtension: ".js",

    // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
    // if the file should be run.  Requires that scripts are coded to be run multiple times.
    useFileHash: false,

    // Don't change this, unless you know what you're doing
    moduleSystem: "esm"
};

export default config;
