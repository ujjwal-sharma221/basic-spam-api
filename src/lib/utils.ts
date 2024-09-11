import prisma from "../prisma";

export const CalculateSpam = async (phoneNumber: string) => {
  try {
    const spamRecord = await prisma.spam.findUnique({
      where: { phoneNumber },
    });

    if (!spamRecord) {
      return { spamLikelihood: "Not Spam", likelihoodScore: 0 };
    }

    const { markedCount } = spamRecord;
    let spamLikelihood: string;
    let likelihoodScore: number;

    if (markedCount > 15) {
      spamLikelihood = "High";
      likelihoodScore = 3;
    } else if (markedCount > 5) {
      spamLikelihood = "Medium";
      likelihoodScore = 2;
    } else if (markedCount > 0) {
      spamLikelihood = "Low";
      likelihoodScore = 1;
    } else {
      spamLikelihood = "Not Spam";
      likelihoodScore = 0;
    }

    return { spamLikelihood, likelihoodScore };
  } catch (error) {
    console.error("Error fetching spam record:", error);
    throw error;
  }
};
