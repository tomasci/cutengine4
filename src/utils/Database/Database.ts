import {PrismaClient} from "../../../prisma/client"

export const db = new PrismaClient()

// it is just simple database wrapper