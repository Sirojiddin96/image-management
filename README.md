
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

4. Running on:
 ```bash
 localhost:3000
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

4. Running on:
 ```bash
 localhost:3000  // if you run first in locally and the docker, please first stop local since docker server runs 3000 port.
 ```

## Architectural Decisions

This project uses the following architectural principles:

- **Next.js Framework**: Chosen for its server-side rendering capabilities and ease of use for building modern web applications.
- **TypeScript**: Ensures type safety and reduces runtime errors.
- **Modular Components**: The application is structured with reusable and maintainable components.
- **API Routes**: Built-in API routes are used for server-side logic.

## Assumptions and Limitations

- The application assumes a modern browser with JavaScript enabled.
- Currently file upload only receives single file including: image/png, image/jpeg, image/jpg, image/webp.
- There is pagination in image list, instead page is scrollable.
