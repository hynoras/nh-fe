import ExperimentDetailClient from "./ExperimentDetailPage.client"

// Experiment detail page has no additional permission gate beyond being authenticated
// (the experiment list page already guards entry into experiments).
// The client component handles its own data fetching.
export default function ExperimentDetailPageServer() {
  return <ExperimentDetailClient />
}
