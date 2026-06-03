# Changelog

All notable changes to the MindMate AI project will be documented in this file.

## [v1.1.0] - AI & User Experience Upgrade
### Added
- **Groq API Integration:** Switched AI inference engine to Groq running Meta's Llama 3 LLM. This reduces chat latency to near-instant responses compared to standard LLM endpoints.
- **AI Safety Guardrails:** Implemented strict System Prompt Engineering in the backend to ensure the AI declines off-topic questions (e.g., coding, IT, politics) and focuses purely on mental health support.
- **Escape Route on Onboarding:** Added a "Cancel & Logout" button on the initial survey form to prevent users from being stuck in a redirection loop on deployment.
- **Interactive Local Support Map:** Integrated `react-leaflet` to visualize nearby mental health clinics using OpenStreetMap tiles.

### Fixed
- Fixed React Router SPA redirection bugs on Vercel deployment using `vercel.json` rewrites.
- Resolved token expiration logic preventing stale states in `AuthContext.jsx`.

## [v1.0.0] - Initial Release
### Added
- MERN Stack scaffolding.
- JWT-based authentication system.
- Initial UI implementation using React 19 and Tailwind CSS.
- Emotional Resonance survey logic.
