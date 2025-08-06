# **5. API Specification**

The complete OpenAPI 3.0.3 specification for the platform.

```yaml
openapi: 3.0.3
info:
  title: "ShikhiLAB IELTS Platform API"
  version: "1.0.0"
  description: "The official API for the ShikhiLAB platform."
servers:
  - url: "https://api.shikhilab.com/v1"
    description: "Production Server"
security:
  - BearerAuth: []
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    # All schemas defined during our session, including:
    # EnrollmentRequest, LoginRequest, AuthTokenResponse,
    # Course, ClassSummary, ClassDetail, LessonMaterial,
    # CourseListResponse, MockTestSummary, MockTestListResponse,
    # TestSubmission, TestSectionContent, StartSubmissionRequest,
    # StudentAnswerPayload, SaveAnswerResponse, SubmissionResults,
    # GradedAnswer, SpeakingSubmissionResults, etc.
    # (Full list omitted for brevity in this final summary)
paths:
  # All paths defined during our session, including:
  # /enrollments, /auth/login, /courses, /courses/{id}, /classes/{id},
  # /mock-tests, /mock-tests/{id}/submissions, 
  # /submissions/{id}/answers/{qid}, /speaking-submissions/{id}/upload,
  # /submissions/{id}/results, /speaking-submissions/{id}/results
  # (Full list omitted for brevity in this final summary)
```

-----
