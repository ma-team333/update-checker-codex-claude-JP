"use client";

import { useState } from "react";
import { ClaudeFeature } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExternalLink, Check } from "lucide-react";

interface FeatureDetailProps {
  feature: ClaudeFeature | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleLearned: (id: string) => void;
  onSaveNotes?: (featureId: string, notes: string) => void;
  notes?: string;
}

const categoryColors: Record<string, string> = {
  tools: "bg-blue-500",
  mcp: "bg-purple-500",
  hooks: "bg-green-500",
  settings: "bg-orange-500",
  general: "bg-gray-500",
  other: "bg-gray-400",
};

export function FeatureDetail({
  feature,
  isOpen,
  onClose,
  onToggleLearned,
  onSaveNotes,
  notes = "",
}: FeatureDetailProps) {
  const [localNotes, setLocalNotes] = useState(notes);

  if (!feature) return null;

  const handleSaveNotes = () => {
    if (onSaveNotes) {
      onSaveNotes(feature.id, localNotes);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={cn("text-xs text-white", categoryColors[feature.category] || "bg-gray-500")}>
              {feature.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              v{feature.version}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{feature.name}</DialogTitle>
          <DialogDescription>
            Released {new Date(feature.releaseDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Description */}
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>

          {/* Changelog link */}
          {feature.changelogUrl && (
            <div>
              <h3 className="font-medium mb-2">Documentation</h3>
              <a
                href={feature.changelogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                View changelog <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Notes */}
          {onSaveNotes && (
            <div>
              <Label htmlFor="notes">Your Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add your notes about this feature..."
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                className="min-h-[100px] mt-2"
              />
              <Button onClick={handleSaveNotes} size="sm" className="mt-2">
                Save Notes
              </Button>
            </div>
          )}

          {/* Learned status */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm font-medium">
                {feature.isLearned ? "You've learned this feature" : "Not yet learned"}
              </p>
              {feature.learnedAt && (
                <p className="text-xs text-muted-foreground">
                  Learned on {new Date(feature.learnedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <Button
              onClick={() => onToggleLearned(feature.id)}
              variant={feature.isLearned ? "outline" : "default"}
              className={cn(
                "gap-2 transition-all duration-150",
                !feature.isLearned && "bg-green-600 hover:bg-green-700"
              )}
            >
              {feature.isLearned ? (
                <>Mark as Unlearned</>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Mark as Learned
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Import cn utility
import { cn } from "@/lib/utils";
