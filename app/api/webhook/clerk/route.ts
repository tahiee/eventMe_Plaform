import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.action';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { CreateUserParams } from '@/types';

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        return new Response('WEBHOOK_SECRET is not defined', { status: 500 });
    }

    const headerPayload = headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response('Missing svix headers', { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    console.log('Received payload:', payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Webhook verification failed', { status: 400 });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === 'user.created') {
        const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
    
        if (!id) {
            return NextResponse.json({ message: 'Error: Missing user ID' }, { status: 400 });
        }
    
        const user: CreateUserParams = {
            clerkId: id, // Now id is guaranteed to be a string
            email: email_addresses[0]?.email_address ?? '',
            username: username ?? '',
            firstName: first_name ?? '',
            lastName: last_name ?? '',
            photo: image_url ?? '',
        };
        console.log('Creating user in MongoDB:', user);
    
        const newUser = await createUser(user);
        console.log('User created in MongoDB:', newUser);
    
        if (newUser) {
            await clerkClient.users.updateUserMetadata(id, {
                publicMetadata: {
                    userId: newUser._id
                }
            });
        }
    
        return NextResponse.json({ message: 'OK', user: newUser });
    }
    
}
