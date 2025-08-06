# **2. High Level Architecture**

### **Technical Summary**

This architecture is for a resilient, scalable, and secure serverless web application. The frontend will be a **Progressive Web App (PWA)** built with Next.js (React) and hosted on Vercel for optimal performance. It will communicate via an API Gateway with a backend running on **Google Cloud Platform (GCP)**. The backend will use a hybrid serverless approach, leveraging **Google Cloud Run** for latency-sensitive APIs to eliminate cold-start risks, and **Google Cloud Functions** for asynchronous background processing. **Data will be stored in a combination of Firestore for its flexibility with user-generated practice data and Cloud SQL for its structured, relational integrity for core course and user authentication data.** All AI processing will be handled by Google Gemini models via a dedicated gateway service.

### **Platform and Infrastructure Choice**

  * **Platform:** A hybrid approach using **Vercel** for the frontend and **Google Cloud Platform (GCP)** for the backend.
  * **Key GCP Services:**
      * **Cloud Run:** For all synchronous, user-facing serverless APIs (Auth, Courses, Practice, etc.).
      * **Cloud Functions:** For asynchronous, event-driven background tasks (e.g., processing uploaded audio files).
      * **API Gateway:** To manage, secure, and route all API requests.
      * **Firestore & Cloud SQL:** For database needs.
      * **Cloud Storage:** For storing user uploads and course materials.
      * **AI Gateway (Cloud Run):** A dedicated service to manage all interactions with the Google AI Platform. It will handle prompt engineering, response parsing, and caching to ensure consistent and cost-effective AI feedback.
      * **Google AI Platform:** To interface with the Gemini models.

### **High Level Architecture Diagram**

```mermaid
graph TD
    subgraph User
        A[Student on Browser/PWA]
    end

    subgraph Vercel
        B[Next.js Frontend PWA]
    end

    subgraph GCP
        C[API Gateway]
        D[Auth Service (Cloud Run)]
        E[Course Service (Cloud Run)]
        F[Practice Service (Cloud Run)]
        G[AI Gateway (Cloud Run)]
        H[Firestore]
        I[Cloud SQL]
        J[Cloud Storage]
        K[Google AI Platform (Gemini)]
        L[Audio Processing (Cloud Function)]
    end

    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    C --> G
    
    D --> I
    E --> I
    E --> J
    F --> H
    F --> J
    G --> K
    
    J -- Triggers --> L
    L -- Updates --> H
```

-----
