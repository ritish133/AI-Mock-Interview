# MockMate AI

MockMate AI is an advanced AI-powered platform for conducting mock interviews and providing personalized, detailed feedback to help you prepare for real-world interviews. With seamless video and audio integration via browser APIs, instant analytics, and intelligent question assessment powered by Gemini AI, MockMate AI offers a comprehensive and interactive practice experience.

## Features

- **AI-Driven Mock Interviews:** Practice with realistic, AI-generated interview questions tailored to your domain and skill level.
- **Gemini AI Integration:** Get in-depth feedback, including overall interview ratings and per-question ratings, powered by Gemini AI.
- **Answer Review:** Review your answers alongside correct or model answers for every question.
- **Camera and Microphone Support:** Respond to interview questions using your webcam and microphone for a real interview simulation, powered by browser APIs.
- **Authentication:** Secure user authentication and account management with Clerk.
- **Payments:** Stripe integration for handling payments and unlocking premium features.
- **Modern UI:** Responsive and beautiful user interface built with Next.js and Tailwind CSS.

## Tech Stack

- **Frontend:** Next.js
- **Styling:** Tailwind CSS
- **Authentication:** Clerk
- **Payments:** Stripe
- **AI Integration:** Gemini AI
- **Media Input:** Camera and microphone support

## Getting Started

### Prerequisites

- Node.js ≥ 16.x
- Yarn or npm

### Installation

```bash
git clone https://github.com/ritish133/AI-Mock-Interview.git
cd AI-Mock-Interview
npm install
# or
yarn install
```

### Configuration

1. Create a `.env.local` file in the root directory.
2. Add your Clerk, Stripe, and Gemini AI API keys, and any other environment variables required for the platform.
3. Update any relevant URLs or configuration in the project settings.

### Running the App

```bash
npm run dev
# or
yarn dev
```
Visit `http://localhost:3000` in your browser.

## Contributing

Pull requests are welcome! For major changes, please open an issue to discuss what you would like to change.


---

> Built with ❤️ by [Ritish Kumar Singh](https://github.com/ritish133)
