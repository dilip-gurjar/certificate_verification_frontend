# CFT Employment Certificates – Frontend

React + Vite + TypeScript + Tailwind frontend for the existing NestJS backend.

    cp .env.example .env      # set VITE_API_BASE_URL
    npm install
    npm run dev               # http://localhost:5173
    npm run build             # type-check + production build

The backend must allow your frontend origin via CORS. When hosting, configure an SPA fallback
(all paths -> index.html) so `/verify/:certificateId` works on refresh.
