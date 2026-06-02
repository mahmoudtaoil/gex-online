import { prisma } from './prisma'

export async function getSettings() {
  let s = await prisma.setting.findFirst({ where: { key: 'main' } })
  if (!s) {
    s = await prisma.setting.create({
      data: { key: 'main' }
    })
  }
  return s
}