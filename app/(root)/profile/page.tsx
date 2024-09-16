import { Button } from "@/components/ui/button";
import Collection from "@/components/ui/shared/Collection";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { getOrdersByUser } from "@/lib/actions/order.actions";
import { IOrder } from "@/lib/database/models/order.model";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;

  const orders = await getOrdersByUser({ userId, page: ordersPage });

  const organized = await getEventsByUser({ userId, page: eventsPage });

  const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];
  console.log(orderedEvents);

  return (
    <>
      {/* My Tickets */}

      <section className="bg-primary-50 bg-dotted-pattern bg-center bg-cover py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href={`/#events`}>Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={orderedEvents}
          emptyTitle="No Events Ticket Purchased yet"
          emptyStateSubtext="No Worries - Plenty of exicting events of explore!"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
      </section>

      {/* Event Organizd */}

      <section className="bg-primary-50 bg-dotted-pattern bg-center bg-cover py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href={`/events/create`}>Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={organized?.data}
          emptyTitle="No Events have been Created yet"
          emptyStateSubtext="Go Create some now"
          collectionType="Events_Organizer"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organized?.totalPages}
        />
      </section>
    </>
  );
};

export default ProfilePage;
