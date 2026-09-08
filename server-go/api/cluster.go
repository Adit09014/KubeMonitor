package api

import (
	"kubepulse-go/api/cluster"
)

// ClusterInfoHandler exposes the cluster info handler.
var ClusterInfoHandler = cluster.Info

// ClusterMetricsHandler exposes the cluster metrics handler.
var ClusterMetricsHandler = cluster.Metrics

// ClusterNodesHandler exposes the cluster nodes handler.
var ClusterNodesHandler = cluster.Nodes