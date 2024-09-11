import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '@/lib/actions/users.actions';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request): Promise<Response> {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occurred -- no svix headers', {
            status: 400,
        });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occurred', {
            status: 400,
        });
    }

    const { id } = evt.data;
    const eventType = evt.type;
    if (!id) {
        return new Response(`${eventType} failed: User ID is missing`, { status: 400 });
    }

    try {
        if (eventType === 'user.created') {
            const { email_addresses, image_url, first_name, last_name, username } = evt.data;

            if (!id) {
                return new Response('User ID is missing', { status: 400 });
            }

            const user = {
                clerkId: id as string,
                email: email_addresses[0].email_address,
                username: username || 'default_username',
                firstName: first_name ?? '',
                lastName: last_name ?? '',
                photo: image_url ?? '',
            };

            const newUser = await createUser(user);

            if (newUser) {
                try {
                    console.log('New user created:', newUser);
                    await clerkClient.users.updateUserMetadata(id, {
                        publicMetadata: {
                            userId: newUser._id,
                        },
                    });
                    console.log('Metadata update successful for Clerk user:', id);
                } catch (error) {
                    console.log(error);
                }
            }

            return NextResponse.json({ message: 'User created successfully', user: newUser });
        }

        if (eventType === 'user.updated') {
            const { image_url, first_name, last_name, username } = evt.data;

            if (!id) {
                return new Response('User ID is missing', { status: 400 });
            }

            const user = {
                firstName: first_name as string,
                lastName: last_name as string,
                username: username || 'default_username',
                photo: image_url,
            };

            const updatedUser = await updateUser(id, user);

            return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
        }

        if (eventType === 'user.deleted') {
            if (!id) {
                return new Response('User ID is missing', { status: 400 });
            }

            const deletedUser = await deleteUser(id);

            return NextResponse.json({ message: 'User deleted successfully', user: deletedUser });
        }
    } catch (error) {
        console.error('Error processing webhook event:', error);
        return new Response('Error processing webhook event', { status: 500 });
    }

    return new Response('Event type not handled', { status: 400 });
}
