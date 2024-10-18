import RecipeForm from '@/components/RecipeForm';
import React from 'react';

export default function page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Add New Recipe</h1>
      <RecipeForm />
    </div>
  );
}
