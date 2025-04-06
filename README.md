
## Required
Docker needs to be installed in OS

## Setup for local run

To set up the project, follow these steps:

1. Clone the repository:
  ```bash
  git clone https://github.com/Sirojiddin96/image-management.git
  cd image-management
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Start the development server:
  ```bash
  npm run dev
  ```

## Setup via docker container

1. Clone the repository:
  ```bash
  git clone https://github.com/Sirojiddin96/image-management.git
  cd image-management
  ```

2. Start project with docker:
  ```bash
  npm run docker-start
  ```

3. Stop server running in docker:
  ```bash
  npm run docker-down
  ```

## Architectural Decisions

This project uses the following architectural principles:

- **Next.js Framework**: Chosen for its server-side rendering capabilities and ease of use for building modern web applications.
- **TypeScript**: Ensures type safety and reduces runtime errors.
- **Modular Components**: The application is structured with reusable and maintainable components.
- **API Routes**: Built-in API routes are used for server-side logic.
- **Limitation**: Currently file upload only receives single file including: image/png, image/jpeg, image/jpg, image/webp.

## Assumptions and Limitations

- The application assumes a modern browser with JavaScript enabled.
- It is designed to run locally or on a Node.js-compatible hosting environment.
