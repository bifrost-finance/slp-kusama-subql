import {
    SubstrateDatasourceKind,
    SubstrateHandlerKind,
    SubstrateProject,
} from "@subql/types";

// Can expand the Datasource processor types via the genreic param
const project: SubstrateProject = {
    specVersion: "1.0.0",
    version: "0.0.1",
    name: "kusama-starter",
    description:
        "This project can be used as a starting point for developing your SubQuery project. It indexes all transfers on Kusama network",
    runner: {
        node: {
            name: "@subql/node",
            version: ">=3.0.1",
        },
        query: {
            name: "@subql/query",
            version: "*",
        },
    },
    schema: {
        file: "./schema.graphql",
    },
    network: {
        /* The genesis hash of the network (hash of block 0) */
        chainId:
            "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe",
        /**
         * These endpoint(s) should be public non-pruned archive node
         * We recommend providing more than one endpoint for improved reliability, performance, and uptime
         * Public nodes may be rate limited, which can affect indexing speed
         * When developing your project we suggest getting a private API key
         * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
         * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
         */
        endpoint: [
            "wss://ksm-rpc.stakeworld.io",
        ],
    },
    dataSources: [
        {
            kind: SubstrateDatasourceKind.Runtime,
            startBlock: 23565536,
            mapping: {
                file: "./dist/index.js",
                handlers: [
                    {
                        kind: SubstrateHandlerKind.Block,
                        handler: "staking",
                    },
                    {
                        kind: SubstrateHandlerKind.Event,
                        handler: "handleStakingErapaid",
                        filter: {
                            module: "staking",
                            method: "EraPaid",
                        },
                    },
                    {
                        kind: SubstrateHandlerKind.Event,
                        handler: "handleStakingBonded",
                        filter: {
                            module: "staking",
                            method: "Bonded",
                        },
                    },
                    {
                        kind: SubstrateHandlerKind.Event,
                        handler: "handleStakinUnbonded",
                        filter: {
                            module: "staking",
                            method: "Unbonded",
                        },
                    },
                    {
                        kind: SubstrateHandlerKind.Event,
                        handler: "handleStakingWithdrawn",
                        filter: {
                            module: "staking",
                            method: "Withdrawn",
                        },
                    },
                    {
                        kind: SubstrateHandlerKind.Event,
                        handler: "handleStakingPayoutstarte",
                        filter: {
                            module: "staking",
                            method: "PayoutStarted",
                        },
                    },
                ],
            },
        },
    ],
};

// Must set default to the project instance
export default project;