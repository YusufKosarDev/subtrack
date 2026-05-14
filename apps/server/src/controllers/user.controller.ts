import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

/**
 * POST /api/users
 * Yeni kullanıcı oluşturur.
 */
export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name } = req.body as {
      email?: string;
      password?: string;
      name?: string;
    };

    // 1. Basit validation
    if (!email || !password) {
      res.status(400).json({
        error: 'Email and password are required',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        error: 'Password must be at least 6 characters long',
      });
      return;
    }

    // 2. Email zaten kullanılıyor mu?
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        error: 'A user with this email already exists',
      });
      return;
    }

    // 3. Şifreyi hash'le
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 4. Kullanıcıyı veritabanına kaydet
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name ?? null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        // password kasıtlı olarak SEÇİLMEDİ - güvenlik!
      },
    });

    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * GET /api/users
 * Tüm kullanıcıları listeler (şifre hariç).
 */
export async function getAllUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // password kasıtlı SEÇİLMEDİ
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
