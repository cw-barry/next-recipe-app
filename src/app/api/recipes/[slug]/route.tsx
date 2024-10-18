import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/recipe';
import { NextRequest, NextResponse } from 'next/server';

// GET method to fetch a recipe by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await dbConnect();
  console.log('slug', params.slug);

  try {
    const recipe = await Recipe.findOne({ slug: params.slug });
    if (!recipe) {
      return NextResponse.json(
        { success: false, message: 'Recipe not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: recipe }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch recipe' },
      { status: 400 }
    );
  }
}

// PUT method to update a recipe by slug
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await dbConnect();

  try {
    const data = await req.json();

    // Find the recipe by slug and update it
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { slug: params.slug },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return NextResponse.json(
        { success: false, message: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedRecipe },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Failed to update recipe' },
      { status: 400 }
    );
  }
}

// DELETE method to delete a recipe by slug
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await dbConnect();

  try {
    const deletedRecipe = await Recipe.findOneAndDelete({ slug: params.slug });

    if (!deletedRecipe) {
      return NextResponse.json(
        { success: false, message: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Recipe deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete recipe' },
      { status: 400 }
    );
  }
}
