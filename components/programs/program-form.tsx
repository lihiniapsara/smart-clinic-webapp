"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Program } from "@/types";

const schema = z.object({
  doctorSlotId: z
    .string()
    .min(1, "Doctor slot ID is required")
    .regex(/^[A-Z0-9-]+$/, "Doctor slot ID must be uppercase letters, numbers, or '-'"),
  description: z.string().min(1, "Doctor details are required"),
});

export type ProgramFormValues = z.infer<typeof schema>;

interface Props {
  program?: Program;
  onSubmit: (values: ProgramFormValues) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProgramForm({ program, onSubmit, onCancel, loading }: Props) {
  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      doctorSlotId: program?.doctorSlotId ?? "",
      description: program?.description ?? "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="doctorSlotId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Slot ID *</FormLabel>
              <FormControl>
                <Input
                  placeholder="CARDIO-AM"
                  {...field}
                  disabled={!!program}
                  className={program ? "bg-slate-50 uppercase" : "uppercase"}
                  onChange={(e) =>
                    field.onChange(e.target.value.toUpperCase())
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Details *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Dr. Silva - Cardiology Morning Slot"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {program ? "Update Doctor Slot" : "Create Doctor Slot"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
