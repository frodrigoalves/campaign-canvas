import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../app";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const role = user.role?.toString().toLowerCase() ?? "buyer";
    const token = jwt.sign({ id: user.id, email: user.email, role }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: { ...userWithoutPassword, role } });
  } catch (error) {
    res.status(500).json({ error: "Erro interno" });
  }
};

export const me = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
};
