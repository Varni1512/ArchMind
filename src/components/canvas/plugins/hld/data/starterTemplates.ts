export interface TemplateNodeDef {
  id: string;
  toolId: string;
  x: number;
  y: number;
}

export interface TemplateEdgeDef {
  source: string;
  target: string;
  isAsync?: boolean;
}

export interface TemplateDef {
  nodes: TemplateNodeDef[];
  edges?: TemplateEdgeDef[];
}

export const starterTemplates: Record<string, TemplateDef> = {
  'default': {
    nodes: [
      { id: 'client', toolId: 'WebApp', x: 100, y: 200 },
      { id: 'api', toolId: 'APIGateway', x: 400, y: 200 },
      { id: 'app', toolId: 'AppServer', x: 700, y: 200 },
      { id: 'db', toolId: 'PostgreSQL', x: 700, y: 350 },
      { id: 'cache', toolId: 'Redis', x: 400, y: 350 }
    ],
    edges: [
      { source: 'client', target: 'api' },
      { source: 'api', target: 'app' },
      { source: 'app', target: 'db' },
      { source: 'app', target: 'cache' }
    ]
  },
  'hld-1': { // Design Instagram
    nodes: [
      { id: 'mobile', toolId: 'MobileApp', x: 100, y: 200 },
      { id: 'cdn', toolId: 'CDN', x: 400, y: 100 },
      { id: 'api', toolId: 'APIGateway', x: 400, y: 300 },
      { id: 'app', toolId: 'Microservice', x: 700, y: 300 },
      { id: 'objStore', toolId: 'ObjectStorage', x: 1000, y: 100 },
      { id: 'db', toolId: 'PostgreSQL', x: 1000, y: 300 }
    ],
    edges: [
      { source: 'mobile', target: 'cdn' },
      { source: 'mobile', target: 'api' },
      { source: 'cdn', target: 'objStore' },
      { source: 'api', target: 'app' },
      { source: 'app', target: 'objStore' },
      { source: 'app', target: 'db' }
    ]
  },
  'hld-2': { // Design WhatsApp
    nodes: [
      { id: 'mobile1', toolId: 'MobileApp', x: 100, y: 150 },
      { id: 'mobile2', toolId: 'MobileApp', x: 100, y: 300 },
      { id: 'ws', toolId: 'Microservice', x: 400, y: 200 },
      { id: 'queue', toolId: 'Kafka', x: 700, y: 200 },
      { id: 'db', toolId: 'NoSQLDatabase', x: 1000, y: 200 }
    ],
    edges: [
      { source: 'mobile1', target: 'ws' },
      { source: 'mobile2', target: 'ws' },
      { source: 'ws', target: 'queue', isAsync: true },
      { source: 'queue', target: 'db', isAsync: true }
    ]
  },
  'hld-3': { // Design URL Shortener
    nodes: [
      { id: 'client', toolId: 'WebApp', x: 100, y: 200 },
      { id: 'api', toolId: 'LoadBalancer', x: 400, y: 200 },
      { id: 'app', toolId: 'AppServer', x: 700, y: 200 },
      { id: 'cache', toolId: 'Redis', x: 1000, y: 100 },
      { id: 'db', toolId: 'SQLDatabase', x: 1000, y: 300 }
    ],
    edges: [
      { source: 'client', target: 'api' },
      { source: 'api', target: 'app' },
      { source: 'app', target: 'cache' },
      { source: 'app', target: 'db' }
    ]
  },
  'hld-4': { // Design Uber
    nodes: [
      { id: 'rider', toolId: 'MobileApp', x: 100, y: 100 },
      { id: 'driver', toolId: 'MobileApp', x: 100, y: 300 },
      { id: 'api', toolId: 'APIGateway', x: 400, y: 200 },
      { id: 'location', toolId: 'Microservice', x: 700, y: 100 },
      { id: 'matching', toolId: 'Microservice', x: 700, y: 300 },
      { id: 'redis', toolId: 'Redis', x: 1000, y: 100 },
      { id: 'db', toolId: 'PostgreSQL', x: 1000, y: 300 }
    ],
    edges: [
      { source: 'rider', target: 'api' },
      { source: 'driver', target: 'api' },
      { source: 'api', target: 'location' },
      { source: 'api', target: 'matching' },
      { source: 'location', target: 'redis' },
      { source: 'matching', target: 'db' },
      { source: 'matching', target: 'redis' }
    ]
  },
  'hld-5': { // All Components Showcase
    nodes: [
      { id: 'c0', toolId: 'User', x: 100, y: 100 },
      { id: 'c1', toolId: 'WebApp', x: 360, y: 100 },
      { id: 'c2', toolId: 'MobileApp', x: 620, y: 100 },
      { id: 'c3', toolId: 'Admin', x: 880, y: 100 },
      { id: 'c4', toolId: 'DNS', x: 1140, y: 100 },
      { id: 'c5', toolId: 'CDN', x: 1400, y: 100 },
      { id: 'c6', toolId: 'APIGateway', x: 100, y: 220 },
      { id: 'c7', toolId: 'ReverseProxy', x: 360, y: 220 },
      { id: 'c8', toolId: 'LoadBalancer', x: 620, y: 220 },
      { id: 'c9', toolId: 'WAF', x: 880, y: 220 },
      { id: 'c10', toolId: 'Firewall', x: 1140, y: 220 },
      { id: 'c11', toolId: 'AppServer', x: 1400, y: 220 },
      { id: 'c12', toolId: 'Microservice', x: 100, y: 340 },
      { id: 'c13', toolId: 'Worker', x: 360, y: 340 },
      { id: 'c14', toolId: 'CronScheduler', x: 620, y: 340 },
      { id: 'c15', toolId: 'SQLDatabase', x: 880, y: 340 },
      { id: 'c16', toolId: 'PostgreSQL', x: 1140, y: 340 },
      { id: 'c17', toolId: 'MySQL', x: 1400, y: 340 },
      { id: 'c18', toolId: 'NoSQLDatabase', x: 100, y: 460 },
      { id: 'c19', toolId: 'MongoDB', x: 360, y: 460 },
      { id: 'c20', toolId: 'Redis', x: 620, y: 460 },
      { id: 'c21', toolId: 'ObjectStorage', x: 880, y: 460 },
      { id: 'c22', toolId: 'FileStorage', x: 1140, y: 460 },
      { id: 'c23', toolId: 'Kafka', x: 1400, y: 460 },
      { id: 'c24', toolId: 'RabbitMQ', x: 100, y: 580 },
      { id: 'c25', toolId: 'Queue', x: 360, y: 580 },
      { id: 'c26', toolId: 'EventBus', x: 620, y: 580 },
      { id: 'c27', toolId: 'Docker', x: 880, y: 580 },
      { id: 'c28', toolId: 'Kubernetes', x: 1140, y: 580 },
      { id: 'c29', toolId: 'Cloud', x: 1400, y: 580 },
      { id: 'c30', toolId: 'Region', x: 100, y: 700 },
      { id: 'c31', toolId: 'Authentication', x: 360, y: 700 },
      { id: 'c32', toolId: 'Notification', x: 620, y: 700 },
      { id: 'c33', toolId: 'Search', x: 880, y: 700 },
      { id: 'c34', toolId: 'Analytics', x: 1140, y: 700 },
      { id: 'c35', toolId: 'Monitoring', x: 1400, y: 700 },
      { id: 'c36', toolId: 'Logging', x: 100, y: 820 },
      { id: 'c37', toolId: 'Payment', x: 360, y: 820 },
      { id: 'c38', toolId: 'Email', x: 620, y: 820 },
      { id: 'c39', toolId: 'SMS', x: 880, y: 820 },
      { id: 'c40', toolId: 'ThirdPartyAPI', x: 1140, y: 820 },
      { id: 'c41', toolId: 'ExternalService', x: 1400, y: 820 },
      { id: 'c42', toolId: 'GraphQL', x: 100, y: 940 },
      { id: 'c43', toolId: 'gRPC', x: 360, y: 940 },
      { id: 'c44', toolId: 'WebSocket', x: 620, y: 940 },
      { id: 'c45', toolId: 'Nginx', x: 880, y: 940 },
      { id: 'c46', toolId: 'Elasticsearch', x: 1140, y: 940 },
      { id: 'c47', toolId: 'Prometheus', x: 1400, y: 940 },
      { id: 'c48', toolId: 'Grafana', x: 100, y: 1060 },
      { id: 'c49', toolId: 'Vault', x: 360, y: 1060 },
      { id: 'c50', toolId: 'Consul', x: 620, y: 1060 }
    ],
    edges: []
  }
};
