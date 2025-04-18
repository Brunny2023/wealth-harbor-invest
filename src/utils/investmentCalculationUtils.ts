
import { Plan, CalculationResults } from '@/types/investment';

/**
 * Calculate investment results based on investment amount and plan details
 * @param amount The amount being invested
 * @param plan The investment plan to use for calculations
 * @returns Complete calculation results
 */
export const calculateInvestmentResults = (amount: number, plan: Plan): CalculationResults => {
  // Daily profit is calculated based on the daily return percentage
  const dailyProfit = amount * (plan.dailyReturn / 100);
  
  // Total profit is calculated by multiplying daily profit by the duration in days
  const totalProfit = dailyProfit * plan.duration;
  
  // Total return is the original investment amount plus the total profit
  const totalReturn = amount + totalProfit;

  // Calculate the return percentage (total profit as a percentage of the initial investment)
  const returnPercentage = (totalProfit / amount) * 100;

  // Calculate the annual percentage yield (APY) based on the daily return
  // Formula: APY = (1 + r)^n - 1, where r is the daily rate and n is the number of days in a year
  const dailyRate = plan.dailyReturn / 100;
  const annualYield = (Math.pow(1 + dailyRate, 365) - 1) * 100;

  return {
    dailyProfit,
    totalProfit,
    totalReturn,
    returnPercentage,
    annualYield,
    duration: plan.duration
  };
};

/**
 * Determine if a user can withdraw profits from a loan-funded investment
 * @param userId The user's ID
 * @param loanAmount The total loan amount received
 * @param accruedProfits The user's total accrued profits
 * @returns Eligibility status and reason if not eligible
 */
export const calculateLoanProfitWithdrawalEligibility = async (
  userId: string,
  loanAmount: number,
  accruedProfits: number
): Promise<{eligible: boolean, reason?: string}> => {
  // User must have doubled their loan amount through daily interests to withdraw profits
  const profitThreshold = loanAmount;
  
  if (accruedProfits < profitThreshold) {
    return {
      eligible: false,
      reason: `You need to accrue at least $${profitThreshold.toFixed(2)} in profits (double your loan amount) before withdrawing. Current accrued profits: $${accruedProfits.toFixed(2)}`
    };
  }
  
  return { eligible: true };
};

/**
 * Calculate loan commitment fee
 * @param loanAmount The requested loan amount
 * @returns The commitment fee (5% of loan amount)
 */
export const calculateLoanCommitmentFee = (loanAmount: number): number => {
  return loanAmount * 0.05; // 5% of loan amount
};

/**
 * Verify if a loan amount is valid based on minimum requirements
 * @param loanAmount The requested loan amount
 * @returns Validation result with status and message
 */
export const validateLoanAmount = (
  loanAmount: number
): {valid: boolean, message?: string} => {
  // Check minimum loan amount
  if (loanAmount < 3500) {
    return {
      valid: false,
      message: `Minimum loan amount is $3,500`
    };
  }
  
  return { valid: true };
};

// Export calculateInvestment as an alias of calculateInvestmentResults for backwards compatibility
export const calculateInvestment = calculateInvestmentResults;
