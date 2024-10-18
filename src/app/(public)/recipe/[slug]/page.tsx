import Image from 'next/image';

interface IRecipe {
  title: string;
  image: string;
  ingredients: string[];
  steps: string[];
  hints?: string[];
}

async function getRecipeBySlug(slug: string): Promise<IRecipe | null> {
  try {
    console.log(slug);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${slug}`,
      // `/api/recipes/${slug}`,
      {
        next: { revalidate: 10 }, // Optional caching with revalidation
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.log((error as Error).message);
  }
}

export default async function RecipePage({
  params,
}: {
  params: { slug: string };
}) {
  const recipe = await getRecipeBySlug(params.slug);

  if (!recipe) {
    return <p>Recipe not found</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <a href="/">
        <button style={{ marginBottom: '20px' }}>Back</button>
      </a>
      <div className="border border-gray-300 rounded-lg p-5 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">{recipe.title}</h1>
        <Image src={recipe.image} alt={recipe.title} width={600} height={400} />

        <h3 className="mt-4 mb-2 text-lg font-bold text-center text-gray-800 dark:text-white sm:text-xl lg:text-2xl">
          Ingredients
        </h3>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li
              className="text-gray-700 dark:text-gray-400 mb-2 list-disc list-inside"
              key={index}
            >
              {ingredient}
            </li>
          ))}
        </ul>

        <h3 className="mt-4 mb-2 text-lg font-bold text-center text-gray-800 dark:text-white sm:text-xl lg:text-2xl">
          Steps
        </h3>
        <ol>
          {recipe.steps.map((step, index) => (
            <li
              className="text-gray-700 dark:text-gray-400 mb-2 list-decimal list-inside"
              key={index}
            >
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
