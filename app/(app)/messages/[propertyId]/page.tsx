"use client";

import { useParams } from "next/navigation";
import { MessagesView } from "@/components/messages/MessagesView";

export default function MessageThreadPage() {
  const params = useParams<{ propertyId: string }>();
  return <MessagesView initialPropertyId={params.propertyId} />;
}
