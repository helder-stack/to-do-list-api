import { DataSource } from "typeorm";

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT),
                username: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                migrations: [
                    __dirname + "/migrations/*.{ts,js}"
                ],
                migrationsRun: true,
                synchronize: false,
            });

            return dataSource.initialize();
        },
    },
]