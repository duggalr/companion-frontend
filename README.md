# Companion

Companion is a web application featuring an online Python REPL environment with an AI Tutor. It is 100% free to use.
To learn more, check out the [blog](https://medium.com/@drahul2820/introducing-companion-an-online-repl-with-an-ai-tutor-85c564fae398).

This repo contains the source code, powering the Companion frontend.

[Here](https://github.com/duggalr/companion-backend) is the repo, powering the Companion backend.

We also have a [discord community](https://discord.gg/rApDKnkY)!

---

## Architecture

Companion is structured with a **Next.js frontend** and a **FastAPI backend**, organized to maintain responsiveness, scalability, and ease of integration. 

### Frontend ([repo](https://github.com/duggalr/companion-frontend/))

- **Framework**: Next.js
- **Styling**: Tailwind.css with shadcn and magicui
- **Deployment**: Hosted on Vercel

### Backend ([repo](https://github.com/duggalr/companion-backend))

- **Framework**: FastAPI
- **Stack**: Using fastapi with celery and redis to manage remote code execution in isolated docker containers. Using Lambda's Inference API (hermes3-405b) for LLM chat completions.
- **Deployment**: Hosted on AWS Elastic Beanstalk

---

## Open Tasks:

1. **Frontend Enhancements**:
   - **Mobile Responsiveness**: Enhance mobile layout, ensuring the REPL and AI Tutor work seamlessly on smaller screens.

2. **Backend Improvements**:
   - **Code Execution Security**: Explore and implement additional security measures for executing Python code in a sandboxed environment.
   - **AI Evaluation**: More robust and automated evaluation of the AI Tutor and ability to test/finetune different LLMs.
   - **Logging and Monitoring**: Add improved logging and monitoring to aid in debugging and performance tracking.

4. **Testing**:
   - **Unit Testing**: Add and improve unit tests for both frontend and backend functionalities.
   - **End-to-End Testing**: Set up end-to-end tests to ensure full app functionality across different devices and browsers.

5. **CI/CD**:
   - **Automate Deployments**: Set up a CI/CD pipeline for automated testing and deployment of both frontend and backend.
