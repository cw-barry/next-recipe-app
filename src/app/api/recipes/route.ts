import dbConnect from '@/lib/mongodb';
import Recipe, { IRecipe } from '@/models/recipe';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const recipes: IRecipe[] = await Recipe.find({});
    return NextResponse.json({ success: true, data: recipes }, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error
    return NextResponse.json(
      { success: false, message: 'Failed to fetch recipes' },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const recipe: IRecipe = await Recipe.create(body);
    return NextResponse.json({ success: true, data: recipe }, { status: 201 });
  } catch (error) {
    console.error(error); // Log the error
    return NextResponse.json(
      { success: false, message: 'Failed to create recipe' },
      { status: 400 }
    );
  }
}
