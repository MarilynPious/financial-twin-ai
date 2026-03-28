const financialTwinAgent = (userData = {}) => ({
  income: Number(userData.income || 0),
  expenses: Number(userData.expenses || 0),
  savings: Number(userData.savings || 0),
  risk: userData.risk || "Balanced",
});

const scenarioAgent = (userQuery = "") => {
  const normalizedQuery = String(userQuery).toLowerCase();

  return {
    raw: userQuery,
    normalizedQuery,
    includesCar: normalizedQuery.includes("car"),
    includesInvest: normalizedQuery.includes("invest"),
  };
};

const impactAgent = (twin, scenario) => {
  if (scenario.includesCar) {
    if (twin.savings < 200000) {
      return `Buying a car now would create strong pressure on your finances because savings are only ${twin.savings} while expenses are ${twin.expenses}.`;
    }

    return `Buying a car looks manageable because your savings are ${twin.savings}, but it will still reduce flexibility for future goals.`;
  }

  if (scenario.includesInvest) {
    return `Increasing investments can support positive long-term growth because income is ${twin.income} and savings are ${twin.savings}.`;
  }

  return `This scenario changes cash flow based on income ${twin.income}, expenses ${twin.expenses}, and savings ${twin.savings}.`;
};

const decisionAgent = (twin, scenario, news = "") => {
  const loweredNews = String(news || "").toLowerCase();
  const riskSignal =
    loweredNews.includes("interest") ||
    loweredNews.includes("inflation") ||
    loweredNews.includes("rbi");

  let message = "";

  if (scenario.includesCar) {
    message =
      twin.savings < 200000
        ? "Delay the car purchase until savings improve because the current buffer is too low."
        : "You can consider the car purchase, but protect an emergency buffer before committing.";
  } else if (scenario.includesInvest) {
    message =
      twin.savings < 200000
        ? "Invest carefully and keep more liquidity before increasing monthly commitments."
        : "You have enough flexibility to increase investing gradually.";
  } else {
    message =
      twin.savings < 200000
        ? "Stay cautious and avoid major financial strain while savings are still limited."
        : "You have moderate flexibility to test this decision in a controlled way.";
  }

  if (riskSignal) {
    message += " Current news suggests higher financial risk because of interest rate or inflation pressure.";
  }

  return message;
};

module.exports = {
  financialTwinAgent,
  scenarioAgent,
  impactAgent,
  decisionAgent,
};
