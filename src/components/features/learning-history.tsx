"use client";

import type { LearningSession } from "@/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LearningHistoryProps {
  sessions: LearningSession[];
}

export function LearningHistory({ sessions }: LearningHistoryProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No learning history yet. Start exploring features!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id}>
          <CardHeader>
            <CardTitle className="text-lg">Feature ID: {session.featureId}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Started: {format(new Date(session.startedAt), "PPP")}</span>
              {session.completedAt && (
                <span>Completed: {format(new Date(session.completedAt), "PPP")}</span>
              )}
            </div>
            {session.notes && (
              <p className="mt-2 text-sm">{session.notes}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
