import Template from './components/Template'
import AssessmentLibrary from './components/assessments/AssessmentLibrary'
import ComplianceDashboard from './components/compliance/ComplianceDashboard'
import StudyManager from './components/studies/StudyManager'
import ParticipantManager from './components/participants/ParticipantManager'

export default [
  {
    path: '/compliance-dashboard',
    name: 'COMPLIANCE DASHBOARD',
    Component: ComplianceDashboard,
  },
  { path: '/study-editor', name: 'STUDY EDITOR', Component: StudyManager },

  {
    path: '/participant-manager',
    name: 'PARTICIPANT MANAGER',
    Component: ParticipantManager,
  },
  {
    path: '/assessment-library',
    name: 'ASSESSMENTS LIBRARY',
    Component: AssessmentLibrary,
  },
  /* { path: "/assessment/:assessmentId", name: "Edit Pizza", Component: Template },
    {
      path: "/pizza/:pizzaId/toppings",
      name: "Pizza Toppings",
      Component: Template
    }*/
]
