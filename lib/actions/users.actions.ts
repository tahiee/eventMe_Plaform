'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '@/lib/database'
import User from '@/lib/database/models/users.model'
import Order from '@/lib/database/models/order.model'
import Event from '@/lib/database/models/event.model'
import { handleError } from '@/lib/utils'

import { CreateUserParams, UpdateUserParams } from '@/types'

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    // Check for existing user with the same clerkId to prevent duplicates
    const existingUser = await User.findOne({ clerkId: user.clerkId });
    if (existingUser) {
      return JSON.parse(JSON.stringify(existingUser));
    }

    // Create a new user
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
    throw error; // Ensure the error is propagated
  }

}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()
    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
    throw error; // Ensure the error is propagated
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase()
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
    throw error; // Ensure the error is propagated
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()
    const userToDelete = await User.findOne({ clerkId })

    if (!userToDelete) throw new Error('User not found')

    await Promise.all([
      Event.updateMany(
        { _id: { $in: userToDelete.events || [] } },
        { $pull: { organizer: userToDelete._id } }
      ),
      Order.updateMany(
        { _id: { $in: userToDelete.orders || [] } },
        { $unset: { buyer: 1 } }
      ),
    ])

    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
    throw error; // Ensure the error is propagated
  }
}
