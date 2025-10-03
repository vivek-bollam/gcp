output "cluster_endpoint" {
  description = "The endpoint for the GKE cluster"
  value       = google_container_cluster.autopilot.endpoint
}

output "artifact_repo" {
  description = "The URL of the Artifact Registry Docker repo"
  value       = "https://${google_artifact_registry_repository.repo.location}-docker.pkg.dev/${google_artifact_registry_repository.repo.project}/${google_artifact_registry_repository.repo.repository_id}"
}


