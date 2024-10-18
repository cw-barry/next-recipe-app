'use client';
import { useEffect, useState } from 'react';
import CardDashboard from './CardDashboard';

interface IRecipe {
  _id: string;
  title: string;
  image: string;
  ingredients: string[];
  steps: string[];
  hints?: string[];
  slug: string;
}

const RecipeList = () => {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch('/api/recipes');
      const data = await response.json();
      if (data.success) {
        setRecipes(data.data);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-5">
        Recipes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes.map((recipe) => (
          <CardDashboard
            key={recipe._id}
            image={recipe.image}
            title={recipe.title}
            slug={recipe.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
