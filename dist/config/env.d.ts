export declare const envVariables: string[];
export declare type DefaultEnvKey = typeof envVariables[number];
export declare class Environment {
    constructor();
    variables: (DefaultEnvKey)[];
    envMap: Map<any, any>;
    initialize: boolean;
    init(): void;
    get(key: DefaultEnvKey): any;
}
export declare const env: Environment;
