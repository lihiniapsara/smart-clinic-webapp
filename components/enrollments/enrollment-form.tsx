"use client";

import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { studentApi, programApi } from "@/lib/api";
import type { Student, Program, Enrollment } from "@/types";

const schema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorSlotId: z.string().min(1, "Doctor slot is required"),
  date: z.string().min(1, "Date is required"),
});

export type EnrollmentFormValues = z.infer<typeof schema>;

interface Props {
  enrollment?: Enrollment;
  onSubmit: (values: EnrollmentFormValues) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function EnrollmentForm({ enrollment, onSubmit, onCancel, loading }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    Promise.all([studentApi.getAll(), programApi.getAll()])
      .then(([s, p]) => {
        setStudents(s);
        setPrograms(p);
      })
      .finally(() => setFetching(false));
  }, []);

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: enrollment?.patientId ?? "",
      doctorSlotId: enrollment?.doctorSlotId ?? "",
      date: enrollment?.date ?? new Date().toISOString().split("T")[0],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={fetching}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={fetching ? "Loading..." : "Select a patient"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.nic} value={s.nic}>
                      {s.name}{" "}
                      <span className="text-slate-400 text-xs">({s.nic})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doctorSlotId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Slot *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={fetching}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={fetching ? "Loading..." : "Select a doctor slot"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p.doctorSlotId} value={p.doctorSlotId}>
                      {p.doctorSlotId} – {p.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Appointment Date *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || fetching}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {enrollment ? "Update Appointment" : "Create Appointment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
