## Setup and Installation

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

## Architectural Decisions

This project uses the following architectural principles:

- **Next.js Framework**: Chosen for its server-side rendering capabilities and ease of use for building modern web applications.
- **TypeScript**: Ensures type safety and reduces runtime errors.
- **Modular Components**: The application is structured with reusable and maintainable components.
- **API Routes**: Built-in API routes are used for server-side logic.

## Running and Testing the Application

To run the application:

1. Start the development server:
  ```bash
  npm run dev
  ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

To test the application:

1. Run the test suite:
  ```bash
  npm test
  ```

2. For end-to-end testing, use a tool like Cypress or Playwright (if configured).

## Assumptions and Limitations

- The application assumes a modern browser with JavaScript enabled.
- It is designed to run locally or on a Node.js-compatible hosting environment.
- Some features may require specific environment variables to be set in `.env.local`.
