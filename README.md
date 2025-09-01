Got it. Here is the updated `README.md` with a concise, easy-to-understand folder structure section included.

---

# My Hair Diary - A Performant React Calendar

This is a custom-built calendar application designed to be incredibly smooth and fast, especially on mobile devices. It features an infinite vertical scroll and a fluid, swipable carousel for viewing journal entries.

### ✨ Live Demo

[You can view the live project here.](https://calendar-app-blush-eight.vercel.app/)


---

### 🏃‍♀️ How to Run Locally

Getting this running on your machine is straightforward.

1.  **Clone the project:**
    ```bash
    git clone https://github.com/Abhisek-Ray99/Calendar-App.git
    cd my-hair-diary-ts
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    npm run dev
    ```

That's it! The app will be running at `http://localhost:5173`.

---

### 📂 Folder Structure

The project is organized with a focus on clarity and separation of concerns.

```
/src
├── components/      # Reusable React components (Calendar, Carousel, Modals, etc.)
├── data/            # Mock data for initial hydration
├── hooks/           # Custom React hooks for complex logic (e.g., calendar generation)
├── types/           # All TypeScript type definitions and interfaces
└── utils/           # Helper functions (e.g., date formatting)
|__ stores/           # Redux-like global store (use-event-store)
|__ modals/           # Modal components (e.g., event form modal)
```

---

### 🤔 Assumptions & Design Choices

I made a few key technical decisions to ensure the app is both performant and maintainable:

*   **No Pre-built Calendar Libraries:** I built the calendar grid and infinite scroll logic from scratch. This was a deliberate choice to demonstrate a deep understanding of performance optimization techniques like **virtualization**, where only visible items are rendered to the DOM.

*   **Performance First (Especially on Mobile):** The swipable carousel was engineered to feel native. It uses `Framer Motion`'s advanced `useMotionValue` and `useTransform` hooks to decouple animations from React's render cycle. This, combined with GPU hardware acceleration (`will-change`), ensures the animations stay smooth even on less powerful devices.

*   **Centralized State:** I used React Context with a `useReducer` hook to create a simple, Redux-like global store. This keeps the app's state management clean and avoids "prop drilling."

*   **TypeScript All the Way:** The entire codebase is written in TypeScript to ensure it's robust, scalable, and easier to debug.