// Configuração do CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://meatburger.com.py",
  process.env.FRONTEND_URL
];

const corsOptions = {
  origin: (origin, callback) => {
    // permitir requests como Postman (sem origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Origin not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));
