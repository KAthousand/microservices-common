/// <reference types="node" />
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
declare type RouteConfig = {
    route: string;
    router: Router;
};
declare type AppConfig = {
    routeConfigs: RouteConfig[];
};
export declare const setupApp: (PrismaClientConstructor: typeof PrismaClient, config: AppConfig) => Promise<{
    app: import("express-serve-static-core").Express;
    server: import("http").Server;
    prismaClient: any;
} | undefined>;
export {};
