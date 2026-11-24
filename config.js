// Set APP_URL to where the AiSaarthi web app is hosted (the Angular app).
// All "Start free", "Log in" and "Buy Premium" buttons point there.
window.AiSaarthi = {
  APP_URL: "http://localhost:4200",
  PATHS: { signup: "/login/signup", login: "/login", checkout: "/login/signup?plan=premium" },
  PREMIUM_USD: 29,
  // Same countries and rates the platform uses to quote prices.
  REGIONS: [
    { code: "US", name: "United States", cur: "$", rate: 1 },
    { code: "IN", name: "India", cur: "₹", rate: 83 },
    { code: "GB", name: "United Kingdom", cur: "£", rate: 0.79 },
    { code: "DE", name: "Germany", cur: "€", rate: 0.92 },
    { code: "FR", name: "France", cur: "€", rate: 0.92 },
    { code: "ES", name: "Spain", cur: "€", rate: 0.92 },
    { code: "IT", name: "Italy", cur: "€", rate: 0.92 },
    { code: "NL", name: "Netherlands", cur: "€", rate: 0.92 },
    { code: "CA", name: "Canada", cur: "CA$", rate: 1.36 },
    { code: "AU", name: "Australia", cur: "A$", rate: 1.52 },
    { code: "AE", name: "United Arab Emirates", cur: "AED ", rate: 3.67 },
    { code: "SG", name: "Singapore", cur: "S$", rate: 1.34 }
  ]
};
