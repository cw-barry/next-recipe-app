import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';
import { nanoid } from 'nanoid'; // You can use nanoid to generate random unique strings

export interface IRecipe extends Document {
  title: string;
  image: string;
  ingredients: string[];
  steps: string[];
  hints?: string[];
  slug: string; // Add slug field to the interface
}

const RecipeSchema: Schema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [String], required: true },
  hints: { type: [String], default: [] },
  slug: { type: String, unique: true }, // Define slug field in the schema
});

// Pre-save hook to auto-generate the slug before saving
RecipeSchema.pre<IRecipe>('save', async function (next) {
  console.log('Pre-save hook triggered for:', this.title);

  // Ensure slug generation happens if it doesn't exist or the title is modified
  if (!this.slug || this.isModified('title')) {
    // Create a slug from the title
    const baseSlug = slugify(this.title, { lower: true, strict: true });

    // Append a unique string (e.g., nanoid for a random unique identifier)
    const uniqueString = nanoid(6); // Generates a 6-character unique string

    // Combine the base slug with the unique string
    this.slug = `${baseSlug}-${uniqueString}`;

    console.log('Unique slug generated:', this.slug); // Debugging slug generation
  }

  next();
});

const Recipe =
  mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Recipe;
