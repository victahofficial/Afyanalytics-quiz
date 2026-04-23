# Afya Stack Notes: Which Language Is Used Where And Why

This note separates what is publicly confirmed on the Afyanalytics website from what can only be reasonably inferred.

## What Afya Publicly Confirms

On [Our Methods](https://afya.ai/our-methods), Afyanalytics lists its technology stack in four areas:

### Data Infrastructure

- PostgreSQL
- MongoDB
- Apache Kafka
- Redis

### Analytics and ML

- Python
- TensorFlow
- PyTorch
- Scikit-learn

### Cloud Platforms

- AWS
- Azure
- Google Cloud
- Private Cloud

### Integration

- HL7 FHIR
- REST APIs
- GraphQL
- gRPC

## Which Language Is Used Where

### Python

Python is the clearest confirmed programming language on their site. It is listed under Analytics and ML, so it is most likely used for:

- data processing pipelines
- predictive analytics
- machine learning models
- natural language processing
- diagnostics-related analytics

Why Python fits:

- it is the most common language for data science and machine learning
- TensorFlow, PyTorch, and Scikit-learn all have strong Python ecosystems
- health analytics work often depends on Python-based ETL, modeling, and research tooling

### SQL

Their site does not say "SQL" explicitly, but PostgreSQL strongly implies SQL is used for relational queries, reporting, and transactional health data.

Why SQL fits:

- healthcare platforms need reliable structured storage
- reporting and analytics often require relational joins and aggregations
- PostgreSQL is a strong fit for audited, structured records

### JavaScript, TypeScript, HTML, and CSS

Afya's public website is clearly a web application, so the website itself necessarily uses standard web technologies:

- HTML for page structure
- CSS for styling and layout
- JavaScript, and possibly TypeScript, for browser-side interactions

Why this is only an inference:

- the public page content does not explicitly name the frontend framework
- from public browsing alone, it is safer not to claim React, Next.js, Vue, or another framework as fact

### API Protocols Instead Of A Single Language

Their site also emphasizes these integration technologies:

- REST APIs
- GraphQL
- gRPC
- HL7 FHIR

These are not languages, but they describe where communication happens between systems.

Why they matter:

- REST and GraphQL are common for web and service APIs
- gRPC is useful for high-performance service-to-service communication
- HL7 FHIR is critical in healthcare for interoperability between clinical systems

## What Seems To Be Used For Which Responsibility

Based on the public site:

- Python is likely used in analytics, ML, and intelligent health data processing
- PostgreSQL and MongoDB are likely used for structured and semi-structured data storage
- Kafka is likely used for event streaming and system-to-system data movement
- Redis is likely used for caching, session-like temporary data, or queues
- Web technologies power the marketing website and any browser-based dashboards
- Cloud platforms host and scale the platform depending on client or regulatory needs

## Why I Chose Node.js For This Test Solution

This submission uses Node.js for the external integration service because:

- it is lightweight and fast to run locally
- modern Node includes `fetch`, so the handshake flow can be implemented with very little code
- it is easy to provide a simple local browser UI for screenshots
- the test focuses on API integration and expiry handling, not machine learning

If this were a production analytics component instead of a handshake integration test, Python would likely be the better fit because Afya explicitly lists it in their analytics and ML stack.
