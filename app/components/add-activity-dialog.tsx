We need to create a new file: app/components/add-activity-dialog.tsx. The task is to add an activity creation dialog with type select, notes field, and association to contact/deal. Since this is a new file, we'll output the final file content. We should use shadcn/ui components: Dialog, Select, Input/Textarea, Button. Also need to handle form state. Since it's a component, we'll use client-side state. We'll assume props for open/onOpenChange and onSave. We'll include fields: type (e.g., call, email, meeting, note), subject, description, contactId?, dealId?. We'll also include a submit button. We'll follow the pattern of shadcn/ui and use cn from utils. Since we don't have imports for utils yet, we'll import from @/lib/utils (common). We'll also import from components/ui. Since this is a new file, we should create it with proper imports.

We need to consider that the component will be used in a form, so we'll use react-hook-form? Not required, simple state is fine. We'll use useState and handleSubmit. We'll also include a select for type with predefined options.

We'll output the full file content.
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AddActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (activity: {
    type: string;
    subject: string;
    description: string;
    contactId?: string;
    dealId?: string;
  }) => void;
  contactId?: string;
  dealId?: string;
}

const activityTypes = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "note", label: "Note" },
  { value: "task", label: "Task" },
];

export function AddActivityDialog({
  open,
  onOpenChange,
  onSave,
  contactId,
  dealId,
}: AddActivityDialogProps) {
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ subject?: string; type?: string }>({});

  const handleSubmit = () => {
    const newErrors: { subject?: string; type?: string } = {};
    if (!type) newErrors.type = "Type is required";
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({
      type,
      subject: subject.trim(),
      description: description.trim(),
      contactId,
      dealId,
    });
    setType("");
    setSubject("");
    setDescription("");
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
          <DialogDescription>
            Log a new activity for this contact or deal.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="activity-type" className="text-right">
              Type
            </Label>
            <Select value={type} onValueChange={(value) => { setType(value); setErrors((prev) => ({ ...prev, type: undefined })); }}>
              <SelectTrigger className={cn("col-span-3", errors.type && "border-red-500")}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="col-span-4 col-start-2 text-sm text-red-500">
                {errors.type}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setErrors((prev) => ({ ...prev, subject: undefined })); }}
              className={cn("col-span-3", errors.subject && "border-red-500")}
              placeholder="Activity subject"
            />
            {errors.subject && (
              <p className="col-span-4 col-start-2 text-sm text-red-500">
                {errors.subject}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Notes
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Optional notes"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Activity</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}