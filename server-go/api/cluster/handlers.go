package cluster

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/gin-gonic/gin"
	corev1 "k8s.io/api/core/v1"

	"kubepulse-go/kubernetes"
)

func getKubernetesClient() (*kubernetes.Client, error) {
	client, err := kubernetes.NewInClusterClient()
	if err == nil {
		return client, nil
	}
	if kubeconfig := os.Getenv("KUBECONFIG"); kubeconfig != "" {
		if c, err := kubernetes.NewOutOfClusterClient(kubeconfig); err == nil {
			return c, nil
		}
	}
	return kubernetes.NewOutOfClusterClient("/etc/rancher/k3s/k3s.yaml")
}

func proxyToRemoteCluster(c *gin.Context) {
	remoteURLStr := os.Getenv("REMOTE_CLUSTER_API")
	if remoteURLStr == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "REMOTE_CLUSTER_API not configured in .env"})
		return
	}
	targetURL, err := url.Parse(remoteURLStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid REMOTE_CLUSTER_API URL: " + err.Error()})
		return
	}
	proxy := httputil.NewSingleHostReverseProxy(targetURL)
	c.Request.Host = targetURL.Host
	proxy.ServeHTTP(c.Writer, c.Request)
}

// Info returns general cluster information.
func Info(c *gin.Context) {
	client, err := getKubernetesClient()
	if err != nil {
		proxyToRemoteCluster(c)
		return
	}

	version, err := client.GetServerVersion()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get server version: " + err.Error()})
		return
	}

	nodes, err := client.GetNodeList()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get node list: " + err.Error()})
		return
	}

	pods, err := client.GetPodList()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get pod list: " + err.Error()})
		return
	}

	deployments, err := client.GetDeploymentList()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get deployment list: " + err.Error()})
		return
	}

	services, err := client.GetServiceList()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get service list: " + err.Error()})
		return
	}

	namespaces, err := client.GetNamespaceList()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get namespace list: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"version": version.GitVersion,
		"nodes":   len(nodes.Items),
		"pods":    len(pods.Items),
		"deployments": len(deployments.Items),
		"services": len(services.Items),
		"namespaces": len(namespaces.Items),
	})
}

// Metrics returns resource usage metrics (simplified).
func Metrics(c *gin.Context) {
	client, err := getKubernetesClient()
	if err != nil {
		proxyToRemoteCluster(c)
		return
	}

	nodes, err := client.GetNodeList()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get node list: " + err.Error()})
		return
	}

	var totalCPU, totalMemory int64
	var allocatableCPU, allocatableMemory int64

	for _, node := range nodes.Items {
		if cpu, found := node.Status.Capacity[corev1.ResourceCPU]; found {
			totalCPU += cpu.MilliValue()
		}
		if memory, found := node.Status.Capacity[corev1.ResourceMemory]; found {
			totalMemory += memory.Value()
		}
		if cpu, found := node.Status.Allocatable[corev1.ResourceCPU]; found {
			allocatableCPU += cpu.MilliValue()
		}
		if memory, found := node.Status.Allocatable[corev1.ResourceMemory]; found {
			allocatableMemory += memory.Value()
		}
	}

	cpuUsage := 0
	if allocatableCPU > 0 {
		// We don't have actual usage, so we'll simulate or leave as 0 for now.
		// In a real scenario, we would get metrics from metrics-server.
		cpuUsage = 0
	}
	memoryUsage := 0
	if allocatableMemory > 0 {
		memoryUsage = 0
	}

	c.JSON(http.StatusOK, gin.H{
		"cpu": map[string]interface{}{
			"capacity":   allocatableCPU,
			"usage":      cpuUsage,
			"unit":       "millicores",
		},
		"memory": map[string]interface{}{
			"capacity":   allocatableMemory,
			"usage":      memoryUsage,
			"unit":       "bytes",
		},
		"nodes": len(nodes.Items),
	})
}

// Nodes returns a list of nodes with their status.
func Nodes(c *gin.Context) {
	client, err := getKubernetesClient()
	if err != nil {
		proxyToRemoteCluster(c)
		return
	}

	nodeList, err := client.GetNodeList()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get node list: " + err.Error()})
		return
	}

	var nodes []gin.H
	for _, node := range nodeList.Items {
		var ready bool
		for _, condition := range node.Status.Conditions {
			if condition.Type == "Ready" && condition.Status == corev1.ConditionTrue {
				ready = true
				break
			}
		}

		nodes = append(nodes, gin.H{
			"name": node.Name,
			"status": gin.H{
				"ready": ready,
				// We can add more conditions if needed
			},
			"capacity": gin.H{
				"cpu":    node.Status.Capacity.Cpu().String(),
				"memory": node.Status.Capacity.Memory().String(),
			},
			"allocatable": gin.H{
				"cpu":    node.Status.Allocatable.Cpu().String(),
				"memory": node.Status.Allocatable.Memory().String(),
			},
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"items": nodes,
	})
}