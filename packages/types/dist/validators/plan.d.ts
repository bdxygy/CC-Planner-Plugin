/**
 * Zod validators for plan types
 */
import { z } from 'zod';
export declare const TechStackSchema: z.ZodObject<{
    framework: z.ZodString;
    language: z.ZodString;
    stateManagement: z.ZodOptional<z.ZodString>;
    testing: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    buildTools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    additional: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    framework: string;
    language: string;
    stateManagement?: string | undefined;
    testing?: string[] | undefined;
    buildTools?: string[] | undefined;
    additional?: string[] | undefined;
}, {
    framework: string;
    language: string;
    stateManagement?: string | undefined;
    testing?: string[] | undefined;
    buildTools?: string[] | undefined;
    additional?: string[] | undefined;
}>;
export declare const ProjectContextSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    techStack: z.ZodObject<{
        framework: z.ZodString;
        language: z.ZodString;
        stateManagement: z.ZodOptional<z.ZodString>;
        testing: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        buildTools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        additional: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        framework: string;
        language: string;
        stateManagement?: string | undefined;
        testing?: string[] | undefined;
        buildTools?: string[] | undefined;
        additional?: string[] | undefined;
    }, {
        framework: string;
        language: string;
        stateManagement?: string | undefined;
        testing?: string[] | undefined;
        buildTools?: string[] | undefined;
        additional?: string[] | undefined;
    }>;
    platform: z.ZodEnum<["frontend", "backend"]>;
    constraints: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    techStack: {
        framework: string;
        language: string;
        stateManagement?: string | undefined;
        testing?: string[] | undefined;
        buildTools?: string[] | undefined;
        additional?: string[] | undefined;
    };
    platform: "frontend" | "backend";
    constraints: string[];
}, {
    name: string;
    description: string;
    techStack: {
        framework: string;
        language: string;
        stateManagement?: string | undefined;
        testing?: string[] | undefined;
        buildTools?: string[] | undefined;
        additional?: string[] | undefined;
    };
    platform: "frontend" | "backend";
    constraints: string[];
}>;
export declare const FeatureSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
    status: z.ZodEnum<["pending", "in-progress", "completed"]>;
    components: z.ZodArray<z.ZodString, "many">;
    acceptanceCriteria: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "in-progress" | "completed";
    name: string;
    description: string;
    id: string;
    priority: "critical" | "high" | "medium" | "low";
    components: string[];
    acceptanceCriteria: string[];
}, {
    status: "pending" | "in-progress" | "completed";
    name: string;
    description: string;
    id: string;
    priority: "critical" | "high" | "medium" | "low";
    components: string[];
    acceptanceCriteria: string[];
}>;
export declare const ComponentDefinitionSchema: z.ZodObject<{
    name: z.ZodString;
    path: z.ZodString;
    type: z.ZodEnum<["page", "layout", "component", "hook", "util"]>;
    props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    dependencies: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    path: string;
    type: "page" | "layout" | "component" | "hook" | "util";
    name: string;
    dependencies: string[];
    props?: Record<string, unknown> | undefined;
}, {
    path: string;
    type: "page" | "layout" | "component" | "hook" | "util";
    name: string;
    dependencies: string[];
    props?: Record<string, unknown> | undefined;
}>;
export declare const StateManagementSchema: z.ZodObject<{
    approach: z.ZodEnum<["redux", "zustand", "context", "mobx", "pinia", "bloc", "provider"]>;
    stores: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    approach: "redux" | "zustand" | "context" | "mobx" | "pinia" | "bloc" | "provider";
    stores: string[];
}, {
    approach: "redux" | "zustand" | "context" | "mobx" | "pinia" | "bloc" | "provider";
    stores: string[];
}>;
export declare const ApiEndpointSchema: z.ZodObject<{
    path: z.ZodString;
    method: z.ZodEnum<["GET", "POST", "PUT", "DELETE", "PATCH"]>;
    description: z.ZodString;
    auth: z.ZodBoolean;
    requestType: z.ZodOptional<z.ZodString>;
    responseType: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    path: string;
    description: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    auth: boolean;
    requestType?: string | undefined;
    responseType?: string | undefined;
}, {
    path: string;
    description: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    auth: boolean;
    requestType?: string | undefined;
    responseType?: string | undefined;
}>;
export declare const RouteDefinitionSchema: z.ZodObject<{
    path: z.ZodString;
    component: z.ZodString;
    layout: z.ZodOptional<z.ZodString>;
    protected: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    path: string;
    component: string;
    protected: boolean;
    layout?: string | undefined;
}, {
    path: string;
    component: string;
    protected: boolean;
    layout?: string | undefined;
}>;
export declare const RoutingConfigSchema: z.ZodObject<{
    type: z.ZodEnum<["file-based", "config-based"]>;
    routes: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        component: z.ZodString;
        layout: z.ZodOptional<z.ZodString>;
        protected: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        path: string;
        component: string;
        protected: boolean;
        layout?: string | undefined;
    }, {
        path: string;
        component: string;
        protected: boolean;
        layout?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    type: "file-based" | "config-based";
    routes: {
        path: string;
        component: string;
        protected: boolean;
        layout?: string | undefined;
    }[];
}, {
    type: "file-based" | "config-based";
    routes: {
        path: string;
        component: string;
        protected: boolean;
        layout?: string | undefined;
    }[];
}>;
export declare const StylingConfigSchema: z.ZodObject<{
    approach: z.ZodEnum<["css", "scss", "tailwind", "styled-components", "emotion"]>;
    themePath: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    approach: "css" | "scss" | "tailwind" | "styled-components" | "emotion";
    themePath?: string | undefined;
}, {
    approach: "css" | "scss" | "tailwind" | "styled-components" | "emotion";
    themePath?: string | undefined;
}>;
export declare const FrontendArchitectureSchema: z.ZodObject<{
    components: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodString;
        type: z.ZodEnum<["page", "layout", "component", "hook", "util"]>;
        props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        dependencies: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        path: string;
        type: "page" | "layout" | "component" | "hook" | "util";
        name: string;
        dependencies: string[];
        props?: Record<string, unknown> | undefined;
    }, {
        path: string;
        type: "page" | "layout" | "component" | "hook" | "util";
        name: string;
        dependencies: string[];
        props?: Record<string, unknown> | undefined;
    }>, "many">;
    state: z.ZodObject<{
        approach: z.ZodEnum<["redux", "zustand", "context", "mobx", "pinia", "bloc", "provider"]>;
        stores: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        approach: "redux" | "zustand" | "context" | "mobx" | "pinia" | "bloc" | "provider";
        stores: string[];
    }, {
        approach: "redux" | "zustand" | "context" | "mobx" | "pinia" | "bloc" | "provider";
        stores: string[];
    }>;
    apis: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        method: z.ZodEnum<["GET", "POST", "PUT", "DELETE", "PATCH"]>;
        description: z.ZodString;
        auth: z.ZodBoolean;
        requestType: z.ZodOptional<z.ZodString>;
        responseType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        description: string;
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        auth: boolean;
        requestType?: string | undefined;
        responseType?: string | undefined;
    }, {
        path: string;
        description: string;
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        auth: boolean;
        requestType?: string | undefined;
        responseType?: string | undefined;
    }>, "many">;
    routing: z.ZodObject<{
        type: z.ZodEnum<["file-based", "config-based"]>;
        routes: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            component: z.ZodString;
            layout: z.ZodOptional<z.ZodString>;
            protected: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            path: string;
            component: string;
            protected: boolean;
            layout?: string | undefined;
        }, {
            path: string;
            component: string;
            protected: boolean;
            layout?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "file-based" | "config-based";
        routes: {
            path: string;
            component: string;
            protected: boolean;
            layout?: string | undefined;
        }[];
    }, {
        type: "file-based" | "config-based";
        routes: {
            path: string;
            component: string;
            protected: boolean;
            layout?: string | undefined;
        }[];
    }>;
    styling: z.ZodObject<{
        approach: z.ZodEnum<["css", "scss", "tailwind", "styled-components", "emotion"]>;
        themePath: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        approach: "css" | "scss" | "tailwind" | "styled-components" | "emotion";
        themePath?: string | undefined;
    }, {
        approach: "css" | "scss" | "tailwind" | "styled-components" | "emotion";
        themePath?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    components: {
        path: string;
        type: "page" | "layout" | "component" | "hook" | "util";
        name: string;
        dependencies: string[];
        props?: Record<string, unknown> | undefined;
    }[];
    state: {
        approach: "redux" | "zustand" | "context" | "mobx" | "pinia" | "bloc" | "provider";
        stores: string[];
    };
    apis: {
        path: string;
        description: string;
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        auth: boolean;
        requestType?: string | undefined;
        responseType?: string | undefined;
    }[];
    routing: {
        type: "file-based" | "config-based";
        routes: {
            path: string;
            component: string;
            protected: boolean;
            layout?: string | undefined;
        }[];
    };
    styling: {
        approach: "css" | "scss" | "tailwind" | "styled-components" | "emotion";
        themePath?: string | undefined;
    };
}, {
    components: {
        path: string;
        type: "page" | "layout" | "component" | "hook" | "util";
        name: string;
        dependencies: string[];
        props?: Record<string, unknown> | undefined;
    }[];
    state: {
        approach: "redux" | "zustand" | "context" | "mobx" | "pinia" | "bloc" | "provider";
        stores: string[];
    };
    apis: {
        path: string;
        description: string;
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        auth: boolean;
        requestType?: string | undefined;
        responseType?: string | undefined;
    }[];
    routing: {
        type: "file-based" | "config-based";
        routes: {
            path: string;
            component: string;
            protected: boolean;
            layout?: string | undefined;
        }[];
    };
    styling: {
        approach: "css" | "scss" | "tailwind" | "styled-components" | "emotion";
        themePath?: string | undefined;
    };
}>;
export declare const ModuleDefinitionSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    responsibilities: z.ZodArray<z.ZodString, "many">;
    dependencies: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    dependencies: string[];
    responsibilities: string[];
}, {
    name: string;
    description: string;
    dependencies: string[];
    responsibilities: string[];
}>;
export declare const DatabaseConfigSchema: z.ZodObject<{
    type: z.ZodString;
    schema: z.ZodArray<z.ZodString, "many">;
    orm: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    schema: string[];
    orm: string;
}, {
    type: string;
    schema: string[];
    orm: string;
}>;
export declare const ServiceDefinitionSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    methods: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    methods: string[];
}, {
    name: string;
    description: string;
    methods: string[];
}>;
export declare const BackendArchitectureSchema: z.ZodObject<{
    modules: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        responsibilities: z.ZodArray<z.ZodString, "many">;
        dependencies: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        dependencies: string[];
        responsibilities: string[];
    }, {
        name: string;
        description: string;
        dependencies: string[];
        responsibilities: string[];
    }>, "many">;
    endpoints: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        method: z.ZodEnum<["GET", "POST", "PUT", "DELETE", "PATCH"]>;
        description: z.ZodString;
        auth: z.ZodBoolean;
        requestType: z.ZodOptional<z.ZodString>;
        responseType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        description: string;
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        auth: boolean;
        requestType?: string | undefined;
        responseType?: string | undefined;
    }, {
        path: string;
        description: string;
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        auth: boolean;
        requestType?: string | undefined;
        responseType?: string | undefined;
    }>, "many">;
    database: z.ZodObject<{
        type: z.ZodString;
        schema: z.ZodArray<z.ZodString, "many">;
        orm: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        schema: string[];
        orm: string;
    }, {
        type: string;
        schema: string[];
        orm: string;
    }>;
    services: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        methods: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        methods: string[];
    }, {
        name: string;
        description: string;
        methods: string[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    modules: {
        name: string;
        description: string;
        dependencies: string[];
        responsibilities: string[];
    }[];
    endpoints: {
        path: string;
        description: string;
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        auth: boolean;
        requestType?: string | undefined;
        responseType?: string | undefined;
    }[];
    database: {
        type: string;
        schema: string[];
        orm: string;
    };
    services: {
        name: string;
        description: string;
        methods: string[];
    }[];
}, {
    modules: {
        name: string;
        description: string;
        dependencies: string[];
        responsibilities: string[];
    }[];
    endpoints: {
        path: string;
        description: string;
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        auth: boolean;
        requestType?: string | undefined;
        responseType?: string | undefined;
    }[];
    database: {
        type: string;
        schema: string[];
        orm: string;
    };
    services: {
        name: string;
        description: string;
        methods: string[];
    }[];
}>;
export declare const TestScenarioSchema: z.ZodObject<{
    id: z.ZodString;
    description: z.ZodString;
    given: z.ZodString;
    when: z.ZodString;
    then: z.ZodArray<z.ZodString, "many">;
    priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
}, "strip", z.ZodTypeAny, {
    description: string;
    id: string;
    priority: "critical" | "high" | "medium" | "low";
    given: string;
    when: string;
    then: string[];
}, {
    description: string;
    id: string;
    priority: "critical" | "high" | "medium" | "low";
    given: string;
    when: string;
    then: string[];
}>;
export declare const TestingPlanSchema: z.ZodObject<{
    unit: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        given: z.ZodString;
        when: z.ZodString;
        then: z.ZodArray<z.ZodString, "many">;
        priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        given: string;
        when: string;
        then: string[];
    }, {
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        given: string;
        when: string;
        then: string[];
    }>, "many">;
    integration: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        given: z.ZodString;
        when: z.ZodString;
        then: z.ZodArray<z.ZodString, "many">;
        priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        given: string;
        when: string;
        then: string[];
    }, {
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        given: string;
        when: string;
        then: string[];
    }>, "many">;
    e2e: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        given: z.ZodString;
        when: z.ZodString;
        then: z.ZodArray<z.ZodString, "many">;
        priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        given: string;
        when: string;
        then: string[];
    }, {
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        given: string;
        when: string;
        then: string[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    unit: {
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        given: string;
        when: string;
        then: string[];
    }[];
    integration: {
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        given: string;
        when: string;
        then: string[];
    }[];
    e2e: {
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        given: string;
        when: string;
        then: string[];
    }[];
}, {
    unit: {
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        given: string;
        when: string;
        then: string[];
    }[];
    integration: {
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        given: string;
        when: string;
        then: string[];
    }[];
    e2e: {
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        given: string;
        when: string;
        then: string[];
    }[];
}>;
export declare const PlanSchema: z.ZodObject<{
    context: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        techStack: z.ZodObject<{
            framework: z.ZodString;
            language: z.ZodString;
            stateManagement: z.ZodOptional<z.ZodString>;
            testing: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            buildTools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            additional: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            framework: string;
            language: string;
            stateManagement?: string | undefined;
            testing?: string[] | undefined;
            buildTools?: string[] | undefined;
            additional?: string[] | undefined;
        }, {
            framework: string;
            language: string;
            stateManagement?: string | undefined;
            testing?: string[] | undefined;
            buildTools?: string[] | undefined;
            additional?: string[] | undefined;
        }>;
        platform: z.ZodEnum<["frontend", "backend"]>;
        constraints: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        techStack: {
            framework: string;
            language: string;
            stateManagement?: string | undefined;
            testing?: string[] | undefined;
            buildTools?: string[] | undefined;
            additional?: string[] | undefined;
        };
        platform: "frontend" | "backend";
        constraints: string[];
    }, {
        name: string;
        description: string;
        techStack: {
            framework: string;
            language: string;
            stateManagement?: string | undefined;
            testing?: string[] | undefined;
            buildTools?: string[] | undefined;
            additional?: string[] | undefined;
        };
        platform: "frontend" | "backend";
        constraints: string[];
    }>;
    features: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
        status: z.ZodEnum<["pending", "in-progress", "completed"]>;
        components: z.ZodArray<z.ZodString, "many">;
        acceptanceCriteria: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "in-progress" | "completed";
        name: string;
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        components: string[];
        acceptanceCriteria: string[];
    }, {
        status: "pending" | "in-progress" | "completed";
        name: string;
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        components: string[];
        acceptanceCriteria: string[];
    }>, "many">;
    architecture: z.ZodUnion<[z.ZodObject<{
        components: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            path: z.ZodString;
            type: z.ZodEnum<["page", "layout", "component", "hook", "util"]>;
            props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            dependencies: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            path: string;
            type: "page" | "layout" | "component" | "hook" | "util";
            name: string;
            dependencies: string[];
            props?: Record<string, unknown> | undefined;
        }, {
            path: string;
            type: "page" | "layout" | "component" | "hook" | "util";
            name: string;
            dependencies: string[];
            props?: Record<string, unknown> | undefined;
        }>, "many">;
        state: z.ZodObject<{
            approach: z.ZodEnum<["redux", "zustand", "context", "mobx", "pinia", "bloc", "provider"]>;
            stores: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            approach: "redux" | "zustand" | "context" | "mobx" | "pinia" | "bloc" | "provider";
            stores: string[];
        }, {
            approach: "redux" | "zustand" | "context" | "mobx" | "pinia" | "bloc" | "provider";
            stores: string[];
        }>;
        apis: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            method: z.ZodEnum<["GET", "POST", "PUT", "DELETE", "PATCH"]>;
            description: z.ZodString;
            auth: z.ZodBoolean;
            requestType: z.ZodOptional<z.ZodString>;
            responseType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            auth: boolean;
            requestType?: string | undefined;
            responseType?: string | undefined;
        }, {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            auth: boolean;
            requestType?: string | undefined;
            responseType?: string | undefined;
        }>, "many">;
        routing: z.ZodObject<{
            type: z.ZodEnum<["file-based", "config-based"]>;
            routes: z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                component: z.ZodString;
                layout: z.ZodOptional<z.ZodString>;
                protected: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                path: string;
                component: string;
                protected: boolean;
                layout?: string | undefined;
            }, {
                path: string;
                component: string;
                protected: boolean;
                layout?: string | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            type: "file-based" | "config-based";
            routes: {
                path: string;
                component: string;
                protected: boolean;
                layout?: string | undefined;
            }[];
        }, {
            type: "file-based" | "config-based";
            routes: {
                path: string;
                component: string;
                protected: boolean;
                layout?: string | undefined;
            }[];
        }>;
        styling: z.ZodObject<{
            approach: z.ZodEnum<["css", "scss", "tailwind", "styled-components", "emotion"]>;
            themePath: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            approach: "css" | "scss" | "tailwind" | "styled-components" | "emotion";
            themePath?: string | undefined;
        }, {
            approach: "css" | "scss" | "tailwind" | "styled-components" | "emotion";
            themePath?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        components: {
            path: string;
            type: "page" | "layout" | "component" | "hook" | "util";
            name: string;
            dependencies: string[];
            props?: Record<string, unknown> | undefined;
        }[];
        state: {
            approach: "redux" | "zustand" | "context" | "mobx" | "pinia" | "bloc" | "provider";
            stores: string[];
        };
        apis: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            auth: boolean;
            requestType?: string | undefined;
            responseType?: string | undefined;
        }[];
        routing: {
            type: "file-based" | "config-based";
            routes: {
                path: string;
                component: string;
                protected: boolean;
                layout?: string | undefined;
            }[];
        };
        styling: {
            approach: "css" | "scss" | "tailwind" | "styled-components" | "emotion";
            themePath?: string | undefined;
        };
    }, {
        components: {
            path: string;
            type: "page" | "layout" | "component" | "hook" | "util";
            name: string;
            dependencies: string[];
            props?: Record<string, unknown> | undefined;
        }[];
        state: {
            approach: "redux" | "zustand" | "context" | "mobx" | "pinia" | "bloc" | "provider";
            stores: string[];
        };
        apis: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            auth: boolean;
            requestType?: string | undefined;
            responseType?: string | undefined;
        }[];
        routing: {
            type: "file-based" | "config-based";
            routes: {
                path: string;
                component: string;
                protected: boolean;
                layout?: string | undefined;
            }[];
        };
        styling: {
            approach: "css" | "scss" | "tailwind" | "styled-components" | "emotion";
            themePath?: string | undefined;
        };
    }>, z.ZodObject<{
        modules: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            responsibilities: z.ZodArray<z.ZodString, "many">;
            dependencies: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            dependencies: string[];
            responsibilities: string[];
        }, {
            name: string;
            description: string;
            dependencies: string[];
            responsibilities: string[];
        }>, "many">;
        endpoints: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            method: z.ZodEnum<["GET", "POST", "PUT", "DELETE", "PATCH"]>;
            description: z.ZodString;
            auth: z.ZodBoolean;
            requestType: z.ZodOptional<z.ZodString>;
            responseType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            auth: boolean;
            requestType?: string | undefined;
            responseType?: string | undefined;
        }, {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            auth: boolean;
            requestType?: string | undefined;
            responseType?: string | undefined;
        }>, "many">;
        database: z.ZodObject<{
            type: z.ZodString;
            schema: z.ZodArray<z.ZodString, "many">;
            orm: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            schema: string[];
            orm: string;
        }, {
            type: string;
            schema: string[];
            orm: string;
        }>;
        services: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            methods: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            methods: string[];
        }, {
            name: string;
            description: string;
            methods: string[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        modules: {
            name: string;
            description: string;
            dependencies: string[];
            responsibilities: string[];
        }[];
        endpoints: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            auth: boolean;
            requestType?: string | undefined;
            responseType?: string | undefined;
        }[];
        database: {
            type: string;
            schema: string[];
            orm: string;
        };
        services: {
            name: string;
            description: string;
            methods: string[];
        }[];
    }, {
        modules: {
            name: string;
            description: string;
            dependencies: string[];
            responsibilities: string[];
        }[];
        endpoints: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            auth: boolean;
            requestType?: string | undefined;
            responseType?: string | undefined;
        }[];
        database: {
            type: string;
            schema: string[];
            orm: string;
        };
        services: {
            name: string;
            description: string;
            methods: string[];
        }[];
    }>]>;
    testing: z.ZodObject<{
        unit: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            description: z.ZodString;
            given: z.ZodString;
            when: z.ZodString;
            then: z.ZodArray<z.ZodString, "many">;
            priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }, {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }>, "many">;
        integration: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            description: z.ZodString;
            given: z.ZodString;
            when: z.ZodString;
            then: z.ZodArray<z.ZodString, "many">;
            priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }, {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }>, "many">;
        e2e: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            description: z.ZodString;
            given: z.ZodString;
            when: z.ZodString;
            then: z.ZodArray<z.ZodString, "many">;
            priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }, {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        unit: {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }[];
        integration: {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }[];
        e2e: {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }[];
    }, {
        unit: {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }[];
        integration: {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }[];
        e2e: {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }[];
    }>;
    tasks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        level: z.ZodEnum<["critical", "high", "medium", "low"]>;
        component: z.ZodString;
        files: z.ZodString;
        testsSuccess: z.ZodArray<z.ZodString, "many">;
        dependencies: z.ZodArray<z.ZodString, "many">;
        blockedBy: z.ZodArray<z.ZodString, "many">;
        blockedByTransitive: z.ZodArray<z.ZodString, "many">;
        dependencyChain: z.ZodArray<z.ZodString, "many">;
        blocks: z.ZodArray<z.ZodString, "many">;
        acceptanceCriteria: z.ZodArray<z.ZodString, "many">;
        estimatedEffort: z.ZodEnum<["S", "M", "L", "XL"]>;
        implementationNotes: z.ZodString;
        done: z.ZodBoolean;
        ready: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        acceptanceCriteria: string[];
        component: string;
        dependencies: string[];
        level: "critical" | "high" | "medium" | "low";
        files: string;
        testsSuccess: string[];
        blockedBy: string[];
        blockedByTransitive: string[];
        dependencyChain: string[];
        blocks: string[];
        estimatedEffort: "S" | "M" | "L" | "XL";
        implementationNotes: string;
        done: boolean;
        ready: boolean;
        createdAt: string;
        updatedAt: string;
    }, {
        name: string;
        id: string;
        acceptanceCriteria: string[];
        component: string;
        dependencies: string[];
        level: "critical" | "high" | "medium" | "low";
        files: string;
        testsSuccess: string[];
        blockedBy: string[];
        blockedByTransitive: string[];
        dependencyChain: string[];
        blocks: string[];
        estimatedEffort: "S" | "M" | "L" | "XL";
        implementationNotes: string;
        done: boolean;
        ready: boolean;
        createdAt: string;
        updatedAt: string;
    }>, "many">;
    metadata: z.ZodObject<{
        planName: z.ZodString;
        platform: z.ZodEnum<["frontend", "backend"]>;
        framework: z.ZodString;
        currentDependencies: z.ZodArray<z.ZodString, "many">;
        createdAt: z.ZodString;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        framework: string;
        platform: "frontend" | "backend";
        createdAt: string;
        planName: string;
        currentDependencies: string[];
        version: string;
    }, {
        framework: string;
        platform: "frontend" | "backend";
        createdAt: string;
        planName: string;
        currentDependencies: string[];
        version: string;
    }>;
}, "strip", z.ZodTypeAny, {
    testing: {
        unit: {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }[];
        integration: {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }[];
        e2e: {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }[];
    };
    context: {
        name: string;
        description: string;
        techStack: {
            framework: string;
            language: string;
            stateManagement?: string | undefined;
            testing?: string[] | undefined;
            buildTools?: string[] | undefined;
            additional?: string[] | undefined;
        };
        platform: "frontend" | "backend";
        constraints: string[];
    };
    features: {
        status: "pending" | "in-progress" | "completed";
        name: string;
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        components: string[];
        acceptanceCriteria: string[];
    }[];
    architecture: {
        components: {
            path: string;
            type: "page" | "layout" | "component" | "hook" | "util";
            name: string;
            dependencies: string[];
            props?: Record<string, unknown> | undefined;
        }[];
        state: {
            approach: "redux" | "zustand" | "context" | "mobx" | "pinia" | "bloc" | "provider";
            stores: string[];
        };
        apis: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            auth: boolean;
            requestType?: string | undefined;
            responseType?: string | undefined;
        }[];
        routing: {
            type: "file-based" | "config-based";
            routes: {
                path: string;
                component: string;
                protected: boolean;
                layout?: string | undefined;
            }[];
        };
        styling: {
            approach: "css" | "scss" | "tailwind" | "styled-components" | "emotion";
            themePath?: string | undefined;
        };
    } | {
        modules: {
            name: string;
            description: string;
            dependencies: string[];
            responsibilities: string[];
        }[];
        endpoints: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            auth: boolean;
            requestType?: string | undefined;
            responseType?: string | undefined;
        }[];
        database: {
            type: string;
            schema: string[];
            orm: string;
        };
        services: {
            name: string;
            description: string;
            methods: string[];
        }[];
    };
    tasks: {
        name: string;
        id: string;
        acceptanceCriteria: string[];
        component: string;
        dependencies: string[];
        level: "critical" | "high" | "medium" | "low";
        files: string;
        testsSuccess: string[];
        blockedBy: string[];
        blockedByTransitive: string[];
        dependencyChain: string[];
        blocks: string[];
        estimatedEffort: "S" | "M" | "L" | "XL";
        implementationNotes: string;
        done: boolean;
        ready: boolean;
        createdAt: string;
        updatedAt: string;
    }[];
    metadata: {
        framework: string;
        platform: "frontend" | "backend";
        createdAt: string;
        planName: string;
        currentDependencies: string[];
        version: string;
    };
}, {
    testing: {
        unit: {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }[];
        integration: {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }[];
        e2e: {
            description: string;
            id: string;
            priority: "critical" | "high" | "medium" | "low";
            given: string;
            when: string;
            then: string[];
        }[];
    };
    context: {
        name: string;
        description: string;
        techStack: {
            framework: string;
            language: string;
            stateManagement?: string | undefined;
            testing?: string[] | undefined;
            buildTools?: string[] | undefined;
            additional?: string[] | undefined;
        };
        platform: "frontend" | "backend";
        constraints: string[];
    };
    features: {
        status: "pending" | "in-progress" | "completed";
        name: string;
        description: string;
        id: string;
        priority: "critical" | "high" | "medium" | "low";
        components: string[];
        acceptanceCriteria: string[];
    }[];
    architecture: {
        components: {
            path: string;
            type: "page" | "layout" | "component" | "hook" | "util";
            name: string;
            dependencies: string[];
            props?: Record<string, unknown> | undefined;
        }[];
        state: {
            approach: "redux" | "zustand" | "context" | "mobx" | "pinia" | "bloc" | "provider";
            stores: string[];
        };
        apis: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            auth: boolean;
            requestType?: string | undefined;
            responseType?: string | undefined;
        }[];
        routing: {
            type: "file-based" | "config-based";
            routes: {
                path: string;
                component: string;
                protected: boolean;
                layout?: string | undefined;
            }[];
        };
        styling: {
            approach: "css" | "scss" | "tailwind" | "styled-components" | "emotion";
            themePath?: string | undefined;
        };
    } | {
        modules: {
            name: string;
            description: string;
            dependencies: string[];
            responsibilities: string[];
        }[];
        endpoints: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            auth: boolean;
            requestType?: string | undefined;
            responseType?: string | undefined;
        }[];
        database: {
            type: string;
            schema: string[];
            orm: string;
        };
        services: {
            name: string;
            description: string;
            methods: string[];
        }[];
    };
    tasks: {
        name: string;
        id: string;
        acceptanceCriteria: string[];
        component: string;
        dependencies: string[];
        level: "critical" | "high" | "medium" | "low";
        files: string;
        testsSuccess: string[];
        blockedBy: string[];
        blockedByTransitive: string[];
        dependencyChain: string[];
        blocks: string[];
        estimatedEffort: "S" | "M" | "L" | "XL";
        implementationNotes: string;
        done: boolean;
        ready: boolean;
        createdAt: string;
        updatedAt: string;
    }[];
    metadata: {
        framework: string;
        platform: "frontend" | "backend";
        createdAt: string;
        planName: string;
        currentDependencies: string[];
        version: string;
    };
}>;
export declare const ValidationErrorSchema: z.ZodObject<{
    type: z.ZodString;
    severity: z.ZodEnum<["error", "warning"]>;
    message: z.ZodString;
    field: z.ZodOptional<z.ZodString>;
    details: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    message: string;
    type: string;
    severity: "error" | "warning";
    field?: string | undefined;
    details?: unknown;
}, {
    message: string;
    type: string;
    severity: "error" | "warning";
    field?: string | undefined;
    details?: unknown;
}>;
export declare const ValidationSummarySchema: z.ZodObject<{
    totalIssues: z.ZodNumber;
    critical: z.ZodNumber;
    byCategory: z.ZodRecord<z.ZodString, z.ZodNumber>;
    passed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    critical: number;
    totalIssues: number;
    byCategory: Record<string, number>;
    passed: boolean;
}, {
    critical: number;
    totalIssues: number;
    byCategory: Record<string, number>;
    passed: boolean;
}>;
export declare const ValidationReportSchema: z.ZodObject<{
    planName: z.ZodString;
    timestamp: z.ZodString;
    errors: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        severity: z.ZodEnum<["error", "warning"]>;
        message: z.ZodString;
        field: z.ZodOptional<z.ZodString>;
        details: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        type: string;
        severity: "error" | "warning";
        field?: string | undefined;
        details?: unknown;
    }, {
        message: string;
        type: string;
        severity: "error" | "warning";
        field?: string | undefined;
        details?: unknown;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        severity: z.ZodEnum<["error", "warning"]>;
        message: z.ZodString;
        field: z.ZodOptional<z.ZodString>;
        details: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        type: string;
        severity: "error" | "warning";
        field?: string | undefined;
        details?: unknown;
    }, {
        message: string;
        type: string;
        severity: "error" | "warning";
        field?: string | undefined;
        details?: unknown;
    }>, "many">;
    summary: z.ZodObject<{
        totalIssues: z.ZodNumber;
        critical: z.ZodNumber;
        byCategory: z.ZodRecord<z.ZodString, z.ZodNumber>;
        passed: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        critical: number;
        totalIssues: number;
        byCategory: Record<string, number>;
        passed: boolean;
    }, {
        critical: number;
        totalIssues: number;
        byCategory: Record<string, number>;
        passed: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    planName: string;
    timestamp: string;
    errors: {
        message: string;
        type: string;
        severity: "error" | "warning";
        field?: string | undefined;
        details?: unknown;
    }[];
    warnings: {
        message: string;
        type: string;
        severity: "error" | "warning";
        field?: string | undefined;
        details?: unknown;
    }[];
    summary: {
        critical: number;
        totalIssues: number;
        byCategory: Record<string, number>;
        passed: boolean;
    };
}, {
    planName: string;
    timestamp: string;
    errors: {
        message: string;
        type: string;
        severity: "error" | "warning";
        field?: string | undefined;
        details?: unknown;
    }[];
    warnings: {
        message: string;
        type: string;
        severity: "error" | "warning";
        field?: string | undefined;
        details?: unknown;
    }[];
    summary: {
        critical: number;
        totalIssues: number;
        byCategory: Record<string, number>;
        passed: boolean;
    };
}>;
//# sourceMappingURL=plan.d.ts.map