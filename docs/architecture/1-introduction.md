# **1. Introduction**

This document outlines the complete fullstack architecture for the **AI-Powered IELTS Crash Course Platform**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

### **Starter Template or Existing Project**

This is a greenfield project. The PRD mandates a **Serverless on Google Cloud** architecture within a **Monorepo**. To accelerate development and ensure best practices, we will use the official **Vercel Next.js Starter with Turborepo**.

  * **Rationale:** Vercel provides a world-class hosting and deployment experience for Next.js, which is ideal for our PWA. Turborepo is a high-performance build system for managing monorepos. The frontend will be hosted on Vercel, while the backend serverless functions will be deployed to Google Cloud Platform, giving us the best of both worlds.

-----
