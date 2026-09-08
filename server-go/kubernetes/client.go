package kubernetes

import (
	"context"
	"fmt"

	corev1 "k8s.io/api/core/v1"
	appsv1 "k8s.io/api/apps/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/version"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

// Client wraps the kubernetes clientset
type Client struct {
	*kubernetes.Clientset
}

// NewInClusterClient creates a new client using the in-cluster configuration.
func NewInClusterClient() (*Client, error) {
	config, err := rest.InClusterConfig()
	if err != nil {
		return nil, fmt.Errorf("failed to get in-cluster config: %w", err)
	}
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, fmt.Errorf("failed to create clientset: %w", err)
	}
	return &Client{clientset}, nil
}

// NewOutOfClusterClient creates a new client using the kubeconfig file.
func NewOutOfClusterClient(kubeconfigPath string) (*Client, error) {
	config, err := clientcmd.BuildConfigFromFlags("", kubeconfigPath)
	if err != nil {
		return nil, fmt.Errorf("failed to build config: %w", err)
	}
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, fmt.Errorf("failed to create clientset: %w", err)
	}
	return &Client{clientset}, nil
}

// GetNodeList returns a list of nodes in the cluster.
func (c *Client) GetNodeList() (*corev1.NodeList, error) {
	return c.CoreV1().Nodes().List(context.TODO(), metav1.ListOptions{})
}

// GetPodList returns a list of pods in the cluster across all namespaces.
func (c *Client) GetPodList() (*corev1.PodList, error) {
	return c.CoreV1().Pods("").List(context.TODO(), metav1.ListOptions{})
}

// GetDeploymentList returns a list of deployments in the cluster across all namespaces.
func (c *Client) GetDeploymentList() (*appsv1.DeploymentList, error) {
	return c.AppsV1().Deployments("").List(context.TODO(), metav1.ListOptions{})
}

// GetServiceList returns a list of services in the cluster across all namespaces.
func (c *Client) GetServiceList() (*corev1.ServiceList, error) {
	return c.CoreV1().Services("").List(context.TODO(), metav1.ListOptions{})
}

// GetNamespaceList returns a list of namespaces in the cluster.
func (c *Client) GetNamespaceList() (*corev1.NamespaceList, error) {
	return c.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})
}

// GetServerVersion returns the Kubernetes server version.
func (c *Client) GetServerVersion() (*version.Info, error) {
	return c.Discovery().ServerVersion()
}