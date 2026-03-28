require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb+srv://admin:admin123@cluster0.tgzqffg.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY is missing. /simulate will use fallback logic only.");
}

let userData = {};

const normalizeBetterOption = (value) => {
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => String(item || "").trim())
      .filter(Boolean);

    return cleaned;
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
};

const parseSimulationResponse = (raw) => {
  const cleaned = String(raw || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const firstBraceIndex = cleaned.indexOf("{");
  const lastBraceIndex = cleaned.lastIndexOf("}");
  const jsonCandidate =
    firstBraceIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > firstBraceIndex
      ? cleaned.slice(firstBraceIndex, lastBraceIndex + 1)
      : cleaned;

  try {
    const parsed = JSON.parse(jsonCandidate);
    if (!Array.isArray(parsed.betterOption)) {
      parsed.betterOption = normalizeBetterOption(parsed.betterOption);
    }

    const betterOption = normalizeBetterOption(parsed.betterOption);

    return {
      impact: parsed.impact || "Financial impact evaluated.",
      recommendation: parsed.recommendation || "Consider carefully.",
      betterOption: betterOption.length
        ? betterOption
        : ["Plan before acting"],
    };
  } catch (error) {
    return {
      impact: "Financial impact analyzed.",
      recommendation: "Evaluate this decision carefully based on your savings.",
      betterOption: [
        "Consider delaying this decision",
        "Review your budget before proceeding",
      ],
    };
  }
};

app.post("/save", (req, res) => {
  userData = req.body;
  res.json({ message: "Data saved", data: userData });
});

app.get("/get", (req, res) => {
  res.json(userData);
});

app.post("/saveProfile", async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);

    const data = req.body.userData || req.body;
    const formattedData = {
      name: data.name || "",
      age: Number(data.age) || 0,
      income: Number(data.income) || 0,
      expenses: Number(data.expenses) || 0,
      savings: Number(data.savings) || 0,
      jobStability: data.jobStability || "",
      dependents: Number(data.dependents) || 0,
      existingEMI: Number(data.existingEMI) || 0,
      healthInsurance: data.healthInsurance || "No",
      investments: Number(data.investments) || 0,
      risk: data.risk || "Balanced",
    };

    console.log("Formatted Data:", formattedData);

    const user = new User(formattedData);
    await user.save();

    res.json({
      message: "Profile saved successfully",
      user,
    });
  } catch (error) {
    console.error("SAVE PROFILE ERROR:", error);
    res.status(500).json({
      message: "Unable to save profile",
    });
  }
});

app.get("/getProfile", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({
      message: "Unable to fetch profiles",
      users: [],
    });
  }
});

app.post("/analyze", (req, res) => {
  const { userData: requestUserData, news, alertText } = req.body;
  const alert = alertText || news || "market update";

  res.json({
    impact: `This alert (${alert}) may affect your financial planning for a ${
      requestUserData?.risk || "balanced"
    } risk profile.`,
    action: "Consider adjusting your investments based on market conditions.",
    confidence: "80%",
  });
});

app.post("/simulate", async (req, res) => {
  const { userData, userQuery, news } = req.body;

  console.log("SIMULATION HIT");
  console.log("BODY:", req.body);

  if (!userQuery || userQuery.trim() === "") {
    return res.json({
      impact: "No query provided.",
      recommendation: "Enter a valid scenario.",
      betterOption: ["Try again."],
    });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      return res.json({
        impact: "Missing API key.",
        recommendation: "Check backend .env file.",
        betterOption: ["Restart server."],
      });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a financial advisor.

You MUST return ONLY valid JSON.
NO text outside JSON.
NO markdown.
NO explanation outside JSON.

All financial values MUST be expressed in Indian Rupees (₹).
Do NOT use dollars or other currencies.

STRICT FORMAT:
{
  "impact": "string",
  "recommendation": "string",
  "betterOption": [
    "string",
    "string",
    "string"
  ]
}

Rules:
- Always include all 3 fields
- betterOption MUST always be an array (minimum 2 items)
- Never return plain text
- Never skip fields
          `,
        },
        {
          role: "user",
          content: `
User:
Income: ${userData?.income}
Expenses: ${userData?.expenses}
Savings: ${userData?.savings}
Risk: ${userData?.risk}

News:
${news}

Question:
${userQuery}
          `,
        },
      ],
    });

    console.log("FULL RESPONSE:", response);

    const raw = response.choices?.[0]?.message?.content || "";
    console.log("RAW:", raw);

    const parsed = parseSimulationResponse(raw);
    const betterOption = normalizeBetterOption(parsed.betterOption);

    return res.json({
      impact: parsed.impact || "Financial impact evaluated.",
      recommendation: parsed.recommendation || "Consider carefully.",
      betterOption: betterOption.length ? betterOption : ["Plan before acting"],
    });
  } catch (err) {
    console.error("ERROR:", err);

    return res.json({
      impact: "Financial impact analyzed.",
      recommendation: "Evaluate this decision carefully based on your savings.",
      betterOption: [
        "Consider delaying this decision",
        "Review your budget before proceeding",
      ],
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
