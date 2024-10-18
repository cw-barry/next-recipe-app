'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';

// Define your form schema
const recipeSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required.',
  }),
  image: z.string().url('Must be a valid URL'),
  ingredients: z.string().min(1, {
    message: 'Ingredients are required.',
  }),
  steps: z.string().min(1, {
    message: 'Steps are required.',
  }),
  hints: z.string().optional(),
});

export default function RecipeForm() {
  // Use the useForm hook with Zod validation
  const form = useForm<z.infer<typeof recipeSchema>>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      image: '',
      ingredients: '',
      steps: '',
      hints: '',
    },
  });

  // Define a submit handler
  const onSubmit = async (values: z.infer<typeof recipeSchema>) => {
    // Split the comma-separated ingredients and steps by '++'
    const parsedValues = {
      ...values,
      ingredients: values.ingredients
        .split('\n')
        .map((ingredient) => ingredient.trim()),
      steps: values.steps.split('\n').map((step) => step.trim()),
      hints: values?.hints?.split('\n').map((step) => step.trim()) || [],
    };

    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedValues),
    });

    if (res.ok) {
      alert('Recipe created successfully!');
      // form.reset();
    } else {
      alert('Error creating recipe');
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-5 max-w-lg mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Recipe Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ingredients"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ingredients (use new lines/enters to separate)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingredient 1 \n Ingredient 2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="steps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Steps (use new lines/enters to separate)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Step 1 \n Step 2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Hints (optional) (use new lines/enters to separate)
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Optional hints" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
