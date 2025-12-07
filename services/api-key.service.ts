import { prisma } from "@/lib/prisma";
import { generateApiKey, hashApiKey, getTokenType } from "@/lib/api-keys";

export class ApiKeyService {
  /**
   * Create a new API key for a user
   */
  static async createKey(userId: string, name: string = "Default") {
    const { key, hash } = generateApiKey();

    const apiKey = await prisma.apiKey.create({
      data: {
        userId,
        name,
        key: hash,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        lastUsedAt: true,
        expiresAt: true,
      },
    });

    // Return the raw key only on creation (won't be retrievable again)
    return {
      ...apiKey,
      key, // Raw key - show to user once
    };
  }

  /**
   * List all API keys for a user (without the actual key)
   */
  static async listKeys(userId: string) {
    return prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        lastUsedAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Delete an API key
   */
  static async deleteKey(userId: string, keyId: string) {
    // Verify ownership before deletion
    const key = await prisma.apiKey.findFirst({
      where: { id: keyId, userId },
    });

    if (!key) {
      return null;
    }

    return prisma.apiKey.delete({
      where: { id: keyId },
    });
  }

  /**
   * Validate an API key or CLI token and return the associated user
   */
  static async validateKey(rawKey: string) {
    const tokenType = getTokenType(rawKey);

    // Handle CLI tokens (from browser OAuth)
    if (tokenType === "cli_token") {
      return this.validateCliToken(rawKey);
    }

    // Handle traditional API keys
    const hash = hashApiKey(rawKey);

    const apiKey = await prisma.apiKey.findUnique({
      where: { key: hash },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            subscription: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    if (!apiKey) {
      return null;
    }

    // Check if key is expired
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return apiKey.user;
  }

  /**
   * Validate a CLI token from browser OAuth flow
   */
  static async validateCliToken(token: string) {
    const session = await prisma.cliAuthSession.findFirst({
      where: {
        token,
        status: "COMPLETED",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            subscription: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    if (!session || !session.user) {
      return null;
    }

    return session.user;
  }

  /**
   * Get the count of API keys for a user
   */
  static async getKeyCount(userId: string) {
    return prisma.apiKey.count({
      where: { userId },
    });
  }
}
