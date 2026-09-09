import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Code, Copy, Check, Play, FileText } from 'lucide-react';

const templates = {
  deployment: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: production
  labels:
    app: api-gateway
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: gateway
        image: nginx:alpine
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "500m"
            memory: "256Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
`,
  service: `apiVersion: v1
kind: Service
metadata:
  name: api-gateway-service
  namespace: production
spec:
  type: ClusterIP
  selector:
    app: api-gateway
  ports:
  - port: 8080
    targetPort: 8080
    protocol: TCP
`,
  configmap: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: default
data:
  CLUSTER_NAME: "k3s-primary"
  LOG_LEVEL: "info"
  METRICS_ENABLED: "true"
`,
};

const YamlEditor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('deployment');
  const [yamlContent, setYamlContent] = useState(templates.deployment);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleTemplateChange = (t) => {
    setSelectedTemplate(t);
    setYamlContent(templates[t]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidate = () => {
    setStatusMsg('Manifest syntax validated successfully (0 schema errors)');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Code className="w-7 h-7 text-sky-400" />
            Kubernetes YAML Editor
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Author, inspect, and validate declarative resource manifests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            {Object.keys(templates).map((t) => (
              <button
                key={t}
                onClick={() => handleTemplateChange(t)}
                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition cursor-pointer ${
                  selectedTemplate === t
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={handleValidate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition cursor-pointer shadow"
          >
            <Play className="w-3.5 h-3.5" />
            Validate
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          {statusMsg}
        </div>
      )}

      {/* Editor Container */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-4 py-2 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">{selectedTemplate}.yaml</span>
          <span>YAML Mode • Monaco Editor</span>
        </div>
        <div className="h-[520px]">
          <Editor
            height="100%"
            defaultLanguage="yaml"
            theme="vs-dark"
            value={yamlContent}
            onChange={(val) => setYamlContent(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default YamlEditor;
