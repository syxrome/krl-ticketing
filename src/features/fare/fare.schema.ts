// src/features/fare/fare.schema.ts
// Zod validation schemas

import { z } from 'zod'

export const fareMethodSchema = z.union([z.literal('A'), z.literal('B')])

export const passengerCategorySchema = z.union([
  z.literal('umum'),
  z.literal('pelajar'),
  z.literal('lansia'),
  z.literal('anak'),
])

export const stationsSchema = z
  .string()
  .min(1, 'Jumlah stasiun tidak boleh kosong')
  .refine((val) => !isNaN(Number(val)), 'Harus berupa angka')
  .refine((val) => Number.isInteger(Number(val)), 'Jumlah stasiun harus berupa bilangan bulat')
  .refine((val) => Number(val) > 0, 'Jumlah stasiun harus lebih dari 0')
  .refine((val) => Number(val) <= 1000, 'Jumlah stasiun terlalu besar')

export const distanceSchema = z
  .string()
  .min(1, 'Jarak tidak boleh kosong')
  .refine((val) => !isNaN(Number(val)), 'Harus berupa angka')
  .refine((val) => Number(val) > 0, 'Jarak harus lebih dari 0')
  .refine((val) => Number(val) <= 10000, 'Jarak terlalu besar')

export const paymentSchema = z
  .string()
  .min(1, 'Nominal pembayaran tidak boleh kosong')
  .refine((val) => {
    const cleaned = val.replace(/[^0-9]/g, '')
    const num = Number(cleaned)
    return !isNaN(num) && num > 0
  }, 'Nominal pembayaran harus lebih dari 0')
