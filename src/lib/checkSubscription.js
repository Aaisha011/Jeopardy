import prisma from "./prisma";
 
async function checkSubscription(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionType: true, subscriptionEnd: true },
  });

  if (user.subscriptionType !== 'free' && user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date()) {
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionType: 'free', subscriptionEnd: null },
    });
  }
}

export default checkSubscription;