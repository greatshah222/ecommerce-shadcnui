"use client";

import { useState } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { useStoreModal } from "@/hooks/use-store-moda";
import { Modal } from "@/components/ui/modal";
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
import { toast } from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // CREATE STORE

    try {
      setLoading(true);

      const res = await axios.post("/api/stores", values);

      // toast.success("Store created");

      // WE ARE USING LOCATION HERE INSTEAD OF LINK CAUSE IF WE USE ROUTER IT MIGHT NOT BE IN SYNC WITH DATABASE

      window.location.assign(`/${res?.data?.id}`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="E-Commerce"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* In Tailwind CSS, the space-x-2 utility class is used to add horizontal spacing between sibling elements. It is part of the space utility classes and provides a shorthand for adding margin-right to the elements. */}

              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  variant={"outline"}
                  onClick={storeModal.onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
